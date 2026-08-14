/**
 * Корневой layout — намеренно пустой. Разметку <html>/<body> рендерит
 * src/app/[locale]/layout.tsx: атрибут lang зависит от локали, а знать её
 * можно только внутри сегмента [locale].
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
