import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using TypeSpec.Http;
using TypeSpec.Rest;

@service(#{
  title: "Web API",
})
@server("http://localhost:3001", "Development server")
namespace WebApi;

/**
 * Hello API response
 */
model HelloResponse {
  message: string;
}

/**
 * Error response
 */
@error
model ErrorResponse {
  statusCode: int32;
  message: string;
  error?: string;
}

/**
 * Hello endpoint operations
 */
@route("/api")
namespace Hello {
  /**
   * Get hello message
   * @returns Hello message
   */
  @get
  @route("/hello")
  @tag("Hello")
  @summary("Get hello message")
  op getHello(): {
    @statusCode statusCode: 200;
    @body body: HelloResponse;
  } | {
    @statusCode statusCode: 401;
    @body body: ErrorResponse;
  };
}
