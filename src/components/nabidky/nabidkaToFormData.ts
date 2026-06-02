import type { Nabidka } from '../../data/mockData'
import type { FormData as NabidkaFormData } from './NovaNabidkaForm'

export function nabidkaToFormData(n: Nabidka): Partial<NabidkaFormData> {
  const typMap: Record<Nabidka['typObjektu'], string> = {
    'dům': 'dum',
    'byt': 'byt',
    'pozemek': 'pozemek',
    'komerční': 'komercni',
  }
  const klientParts = n.klient.split(' ')
  const jmeno = klientParts[0] ?? ''
  const prijmeni = klientParts.slice(1).join(' ')
  return {
    typNemovitosti: typMap[n.typObjektu] ?? 'dum',
    nazevNabidky: n.nazev,
    adresa: n.adresa,
    podkategorie: [n.podkategorie],
    cena: String(n.cena),
    vyhradniSpoluprace: n.vyhradni,
    jmeno,
    prijmeni,
  }
}
