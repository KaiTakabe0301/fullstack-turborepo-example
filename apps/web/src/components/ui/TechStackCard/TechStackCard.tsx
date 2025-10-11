export interface TechStackCardProps {
  name: string;
  description: string;
  version?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export function TechStackCard({
  name,
  description,
  version,
  ref,
}: TechStackCardProps) {
  return (
    <div
      ref={ref}
      className='bg-black/[.03] dark:bg-white/[.06] border border-black/[.1] dark:border-white/[.145] rounded-lg p-6 hover:bg-black/[.06] dark:hover:bg-white/[.08] transition-colors'
    >
      <div className='flex justify-between items-start mb-2'>
        <h3 className='text-lg font-semibold text-foreground'>{name}</h3>
        {version && (
          <span className='text-sm text-foreground/60 font-mono'>{version}</span>
        )}
      </div>
      <p className='text-sm text-foreground/80'>{description}</p>
    </div>
  );
}
