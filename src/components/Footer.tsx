import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E5E7EB] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <img src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 40'%3E%3Cg fill='%230F2A44'%3E%3Cpath d='M20 4L36 20L20 36L4 20Z'/%3E%3Cpath d='M36 4L52 20L36 36L20 20Z' opacity='0.85'/%3E%3Ctext x='70' y='28' font-family='Inter, system-ui, -apple-system' font-size='22' font-weight='700' letter-spacing='2'%3EBETWIX%3C/text%3E%3C/g%3E%3C/svg%3E" alt="Betwix" className="h-8 mb-2" />
          <div className="text-slate-500">Инвестиции в доходную недвижимость</div>
          <div className="mt-4 text-slate-400">© Betwix, 2026</div>
        </div>
        <div>
          <div className="font-semibold text-slate-900 mb-2">Продукт</div>
          <ul className="space-y-1 text-slate-500">
            <li><Link to="/lots" className="hover:text-slate-700">Лоты</Link></li>
            <li><Link to="/p2p" className="hover:text-slate-700">P2P рынок</Link></li>
            <li><Link to="/how-it-works" className="hover:text-slate-700">Как это работает</Link></li>
            <li><Link to="/market-news" className="hover:text-slate-700">Новости рынка</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-slate-900 mb-2">Компания</div>
          <ul className="space-y-1 text-slate-500">
            <li><Link to="/about" className="hover:text-slate-700">О платформе</Link></li>
            <li><Link to="/how-we-earn" className="hover:text-slate-700">Как мы зарабатываем</Link></li>
            <li><Link to="/rating-methodology" className="hover:text-slate-700">Методика рейтингов</Link></li>
            <li><Link to="/risks" className="hover:text-slate-700">Риски инвестирования</Link></li>
            <li><Link to="/documents" className="hover:text-slate-700">Документы и правила</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-slate-900 mb-2">Поддержка</div>
          <ul className="space-y-1 text-slate-500">
            <li><Link to="/faq" className="hover:text-slate-700">FAQ</Link></li>
            <li><Link to="/contacts" className="hover:text-slate-700">Контакты</Link></li>
            <li><Link to="/support" className="hover:text-slate-700">Центр поддержки</Link></li>
            <li><Link to="/for-management-companies" className="hover:text-slate-700">Управляющим компаниям</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#E5E7EB] py-4 text-center text-xs text-slate-400">© 2026 Betwix. Все права защищены</div>
    </footer>
  );
}
