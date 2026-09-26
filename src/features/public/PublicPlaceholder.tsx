import { Link } from 'react-router'

export function PublicPlaceholder() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">Gio's Kebab</p>
      <h1 className="text-3xl font-bold tracking-tight">Public website foundation</h1>
      <p className="max-w-prose text-slate-700">
        This route is ready for the restaurant website. The public experience will be added in a later slice.
      </p>
      <Link className="w-fit rounded-md underline underline-offset-4" to="/admin">
        Open the admin placeholder
      </Link>
    </main>
  )
}
