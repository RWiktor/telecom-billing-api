export default function Footer() {
  return (
    <footer className='border-t bg-card mt-auto'>
      <div className='container mx-auto px-4 py-4'>
        <p className='text-sm text-center text-muted-foreground'>
          © {new Date().getFullYear()} Telecom Billing
        </p>
      </div>
    </footer>
  )
}
