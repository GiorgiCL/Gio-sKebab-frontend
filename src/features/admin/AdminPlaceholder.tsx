import { Link } from 'react-router'

export function AdminPlaceholder() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">Gio's Kebab</p>
      <h1 className="text-3xl font-bold tracking-tight">Admin area foundation</h1>
      <p className="max-w-prose text-slate-700">
        This route is ready for the owner CMS. Authentication and management screens will be added in later slices.
      </p>
      <Link className="w-fit rounded-md underline underline-offset-4" to="/">
        Return to the public placeholder
      </Link>
    </main>
  )
}
