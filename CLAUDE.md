# CLAUDE.md — myBRIK

> Tento soubor říká Claude Code jak pracovat v tomto projektu.

---

## O projektu

**myBRIK** je CRM platforma od SAB servis, která propojuje finanční a realitní byznys do jednoho prostředí.

### Cílová skupina
- Finanční poradci a vedoucí makléřských kanceláří
- Realitní makléři
- Asistenti pobočky
- Majitelé poboček a vedoucí týmů

### Účel
Umožňuje zpracovat celý životní cyklus obchodu — akvizici klienta, obsluhu i průběžný servis — v jedné aplikaci. Propojuje realitní a finanční agendu (hypotéky, pojištění, provize) s CRM funkcemi.

### Klíčové moduly
- **Nabídky** — tvorba a správa realitních nabídek, přiřazení více makléřů, sdílení provizí, publikace na realitní servery
- **Obchod** — leady, příležitosti, zájem o výkup, nabídka nemovitostí
- **Klienti** — evidence klientů, poptávky (obecné i specifické), automatické párování s nabídkami
- **Kalendář** — plánování schůzek a událostí (měsíc/týden/den)
- **Statistiky** — přehled rezervací, plateb a měsíčního výkonu
- **Vyúčtování** — náklady, storno, provize, výplaty, faktury
- **Lidé** — správa uživatelů, pobočky, HSP, role a práva
- **Dokumenty** — firemní dokumenty

### Technologie
- Vite + React 18 + TypeScript
- Tailwind CSS
- Design system: `@matusgallo/mysabds`
- React Router v6
- Recharts (grafy)

---

## Design System

Tento projekt používá sdílený design system `@matusgallo/mydock-ui`.

### POVINNÉ PRAVIDLO

Před jakoukoli prací na UI komponentách nebo obrazovkách:

1. Načti `node_modules/@matusgallo/mydock-ui/docs/design-system.md`
2. Importuj komponenty výhradně z `@matusgallo/mydock-ui`
3. Na začátku entry pointu importuj tokeny: `import '@matusgallo/mydock-ui/tokens.css'`

### Dostupné komponenty

```tsx
import {
  Button, IconButton, TextButton,
  TextField, TextArea, Select, Checkbox, Radio, Switch, Toggle,
  Avatar, Badge, Tag, Alert, Tooltip,
  Dialog, Menu, Filter,
  LineTab, PillTab,
  Form, FormHeader, FormBody, FormFooter, FormTitleHeader,
  NavItem, NavAppItem, NavGroupHeadline, NavDivider, FloatingNav,
  TableCell, TableHeaderCell,
  Divider, Breadcrumbs, Pagination,
  CheckboxItem, CheckboxGroupItem,
} from '@matusgallo/mydock-ui'
```

### UX Writing guidelines

Před psaním textů v UI načti všechny soubory ze složky `node_modules/@matusgallo/mydock-ui/IN/`:
- `IN/INFO_UXWRITTING.md` — obecná UX writing pravidla
- `IN/INFO_CTA.md` — pravidla pro výzvy k akci
- `IN/INFO_FORMATOVANI.md` — formátování textů
- `IN/INFO_Gramaticka-forma.md` — gramatická forma
- `IN/INFO_Popisky-zastupne-texty.md` — popisky a zástupné texty
- `IN/INFO_Typograficke-pravidla.md` — typografická pravidla
- `IN/INFO-Prazdne-stavy.md` — prázdné stavy
- `IN/Typography.md` — typografie

---

## Instalace závislostí

Projekt vyžaduje `.npmrc` s GitHub token pro stažení `@matusgallo/mydock-ui`.
Viz `.npmrc.example` pro formát.

```
@matusgallo:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<GITHUB_PAT_read_packages>
```
