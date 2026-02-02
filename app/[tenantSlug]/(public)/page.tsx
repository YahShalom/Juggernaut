export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to the Public Page</h1>
      <p className="mt-4">This is a test page to demonstrate the styling.</p>
      <div className="mt-8 flex gap-4">
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">Primary Button</button>
        <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg">Secondary Button</button>
      </div>
    </div>
  )
}