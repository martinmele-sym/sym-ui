import { SymSidebar } from './components/SymSidebar'
import { SymphonicaShowcase } from './showcase/SymphonicaShowcase'

export default function App() {
  return (
    <div className="sym-app-shell">
      <SymSidebar />
      <main className="sym-app-main">
        <SymphonicaShowcase />
      </main>
    </div>
  )
}
