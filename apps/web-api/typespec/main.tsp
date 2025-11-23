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
  @minLength(1)
  message: string;
}

/**
 * Error response
 */
@error
model ErrorResponse {
  statusCode: int32;
  @minLength(1)
  message: string;
  error?: string;
}

/**
 * Hello endpoint operations
 */
@route("/v1")
namespace Hello {
  /**
   * Get hello message
   * Requires JWT Bearer authentication
   * @returns Hello message
   */
  @get
  @route("/hello")
  @tag("Hello")
  @summary("Get hello message")
  @useAuth(BearerAuth)
  op getHello(): {
    @statusCode statusCode: 200;
    @body body: HelloResponse;
  } | {
    @statusCode statusCode: 401;
    @body body: ErrorResponse;
  };
}

alias BearerAuth = ApiKeyAuth<ApiKeyLocation.header, "Authorization">;
