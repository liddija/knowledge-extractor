# Projektbeschreibung: Knowledge Extractor

## Projekttitel
**Knowledge Extractor** — Aus KI-Gesprächen werden Wissens-Assets für Teams

---

## 1. Ausgangssituation & Problem

Täglich nutzen Teams KI-Tools wie ChatGPT, Claude, Gemini, Manus usw. Dabei entsteht wertvolles Wissen:

- Erprobte Workflows und Schritt-für-Schritt-Prozesse
- Bewährte Entscheidungsmuster und Problemlösungsstrategien
- Hochwertige, fein abgestimmte Prompts
- Recherche-Ergebnisse und kuratierte Informationssammlungen
- Kreative Konzepte, Textentwürfe und Content-Strategien
- Technische Lösungen, Code-Snippets und Debugging-Ansätze
- Kundenbriefings, Zielgruppenanalysen und Markteinschätzungen
- Tonalitäts- und Markenrichtlinien, die im Dialog mit KI verfeinert wurden
- Gelernte Lektionen aus Trial-and-Error mit verschiedenen KI-Tools

Doch dieses Wissen bleibt in individuellen Chat-Verläufen eingesperrt — unsichtbar für Kolleg:innen, verloren beim Teamwechsel und vor allem es verfällt beim Tool-Wechsel.

**Das Kernproblem:** Unternehmen zahlen mehrfach für dieselbe Wissensarbeit, die dann Wochen oder gar Monate in Anspruch nehmen kann. Jede Person im Team erarbeitet sich eigene Workflows mit KI, ohne von den Erfahrungen der anderen zu profitieren. Wenn Mitarbeiter:innen das Unternehmen verlassen, geht dieses implizite Wissen unwiederbringlich verloren.

Bestehende Lösungen wie Anthropics Memory-Import oder AI Context Flow migrieren lediglich Rohdaten zwischen Tools, und dann meistens nur einen Fragement den man grad angesprochen hat. Sie **extrahieren kein verwertbares Wissen** daraus. 

---

## 2. Lösung: Knowledge Extractor

Knowledge Extractor ist eine Web-App, die KI-Gesprächsverläufe analysiert und daraus drei konkrete Wissens-Assets (jetzt als MVP, wird stufenweise erweitert) generiert:

### Standard Operating Procedures (SOPs)
Die App erkennt wiederkehrende Arbeitsabläufe in den Gesprächen und erstellt daraus strukturierte, schrittweise Anleitungen. Beispiel: Ein:e Mitarbeiter:in hat über Monate hinweg einen spezifischen Workflow für die Erstellung von Social-Media-Content mit KI entwickelt. Knowledge Extractor identifiziert diesen Prozess und generiert daraus eine SOP, die das gesamte Team sofort nutzen kann.

### Muster-Analyse (Pattern Reports)
Die App identifiziert wiederkehrende Themen, Entscheidungsmuster und Wissenslücken. Welche Fragen werden häufig gestellt? Welche Entscheidungen werden konsistent getroffen? Wo gibt es Wissenslücken, die Schulungsbedarf signalisieren?

### Prompt-Vorlagen (Prompt Templates)
Die besten, strukturiertesten Prompts werden extrahiert und in wiederverwendbare Vorlagen mit Platzhalter-Variablen umgewandelt. Statt dass jede:r eigene Prompts von Grund auf schreibt, kann das Team auf eine kuratierte Bibliothek bewährter Prompts zugreifen.

---

## 3. Strategie

### Zielgruppe
Kleine und mittlere Teams, die KI-Tools bereits aktiv einsetzen.

### Go-to-Market
- **Phase 1 (Q2 2026):** MVP (SOP, Muster-Analyse, Prompt Vorlagen) als kostenlose Web-App. Nutzer:innen verwenden ihren eigenen API-Key — kein Backend, kein Server, keine laufenden Kosten. Maximale Datenschutz-Konformität.
- **Phase 2 (Q3 2026):** Team-Features: Lessons Learned, Onboarding-Paket für neue Mitarbeiter:innen, Klientenpersonas, Export nach Notion/Google Docs per MCP.
- **Phase 3 (Q4 2026):** Integration von Small Language Models (SLMs), die lokal auf Endgeräten laufen. Geringerer Energieverbrauch, funktioniert offline, zugänglich für Teams in Regionen mit eingeschränkter Konnektivität.

### Technologie-Stack
- Next.js + React (Web-App)
- Eigener API-Key der Nutzer:innen (kein zentraler Server nötig)
- Client-seitige Verarbeitung für maximalen Datenschutz
- Zukunft: Small Language Models für lokale, energieeffiziente Verarbeitung

### Geschäftsmodell
- Freemium: Basis-Analyse kostenlos (eigener API-Key)
- Team-Plan: Gemeinsame Wissensbasis, Verwaltung, Export-Funktionen
- Enterprise: On-Premise-Deployment, SSO, Compliance-Features

---

## 4. Einzigartigkeit & Innovation

| Bestehende Lösungen | Knowledge Extractor |
|---|---|
| Migrieren Rohdaten zwischen KI-Tools | **Veredelt** Rohdaten zu strukturiertem Teamwissen |
| Individuelle Memory-Synchronisation | Team-orientierte Wissensextraktion |
| Speichern Konversationen als Text | Generiert sofort nutzbare SOPs, Muster-Analysen und Prompt-Vorlagen |
| Zentralisierte Cloud-Verarbeitung | Privacy-first: Alles im Browser, API-Key bleibt beim User |
| Einmalige Migration | Kontinuierliche Wissensgewinnung aus laufender KI-Nutzung |

**Was es einzigartig macht:** Knowledge Extractor ist das erste Tool, das die **implizite Wissensbasis** eines Teams — verborgen in hunderten KI-Gesprächen — sichtbar und nutzbar macht. Es ist kein Migrations-Tool, sondern ein **Wissensmanagement-System für das KI-Zeitalter**.

---

## 5. Erwarteter Outcome

Da das Projekt sich in der MVP-Phase befindet, basieren die Outcomes auf konservativen Projektionen und vergleichbaren Marktdaten:

### Quantitative Projektion
- **Zeitersparnis:** 5–8 Stunden pro Teammitglied pro Monat durch Wiederverwendung extrahierter SOPs und Prompts (basierend auf Daten von AI Context Flow: 8–15 Stunden/Woche bei ähnlichen Tools)
- **Wissensbewahrung:** 100% der dokumentierten KI-Workflows bleiben beim Mitarbeiter:innen-Wechsel erhalten (vs. 0% bei herkömmlicher Chat-Nutzung)
- **Onboarding-Beschleunigung:** Neue Teammitglieder erhalten sofort Zugang zu erprobten Workflows und Prompt-Vorlagen — geschätzte Reduktion der Einarbeitungszeit um 30-40%

### Qualitative Outcomes
- **Demokratisierung von KI-Expertise:** Das Wissen der Power-User wird für das gesamte Team zugänglich
- **Konsistenz:** Standardisierte SOPs statt individueller Ad-hoc-Workflows
- **Sichtbarkeit:** Erstmals ist messbar, WIE ein Team KI einsetzt — wo die Stärken liegen und wo Schulungsbedarf besteht

### Geplante Validierung (Q2 2026)
- Pilot mit 5 Wiener Agenturen aus der Fachgruppe
- Vorher/Nachher-Messung: Zeitaufwand für wiederkehrende KI-Aufgaben
- Qualitative Interviews: Teamzufriedenheit und Wissenstransfer

---

## 6. SDG-Bezug: Soziale und ökologische Nachhaltigkeit

Knowledge Extractor adressiert fünf UN-Nachhaltigkeitsziele:

### SDG 4: Hochwertige Bildung (Ziel 4.7 — Lebenslanges Lernen)
Knowledge Extractor fungiert als **"Second Brain"** für Teams. Die App hilft Nutzer:innen, komplexe Konzepte aus KI-Gesprächen in strukturierte Lernunterlagen und Referenzbibliotheken zu synthetisieren. Implizites Wissen wird zu explizitem, teilbarem Lernmaterial.

### SDG 8: Menschenwürdige Arbeit und Wirtschaftswachstum
Die App fördert **produktive Beschäftigung** durch Wissensbewahrung und effiziente Arbeitsabläufe. Sie schließt die Lücke zwischen Rohdaten und anwendbarer Bildung.

### SDG 9: Industrie, Innovation und Infrastruktur (Ziel 9.5)
Sie bietet eine digitale Infrastruktur für Innovationen und stellt sicher, dass fortschrittliche KI auch in Regionen mit schlechter Internetverbindung zugänglich ist (Unterziel 9.c).

### SDG 12: Nachhaltige Konsum- und Produktionsmuster
Der geplante Einsatz von **Small Language Models (SLMs)** ist hier der zentrale Nachhaltigkeits-Baustein:
- SLMs laufen lokal auf Endgeräten mit **bis zu 100x geringerem Energieverbrauch** als Cloud-basierte Large Language Models
- Können auch offline — zugänglich für Feldarbeiter:innen in Gebieten mit eingeschränkter Internetanbindung funktionieren

### SDG 17: Partnerschaften zur Erreichung der Ziele (Ziel 17.16)
Knowledge Extractor fördert **institutionelles Wissensmanagement** über Organisationsgrenzen hinweg. Konkretes Anwendungsbeispiel: NGOs könnten monatelange Feldarbeiter:innen-Logs in "Lessons Learned" zusammenfassen und so ein **gemeinsames institutionelles Gedächtnis** schaffen, das zukünftige Projekte informiert und verbessert.

---

## 7. Zusammenfassung

In wenigen Minuten extrahiert Knowledge Extractor Wissen, das manuell **Wochen oder Monate** bräuchte — wenn es überhaupt machbar wäre. Meistens würde dieses Wissen einfach verfallen.

Knowledge Extractor macht erstmals sichtbar, was Teams durch ihre tägliche KI-Nutzung bereits aufgebaut haben, ohne es zu wissen:

- **Fertige Arbeitsanleitungen**, die sonst niemand je dokumentiert hätte
- **Entscheidungsmuster**, die zeigen, wie ein Team tatsächlich denkt und arbeitet
- **Eine Prompt-Bibliothek**, für die man Expert:innen hätte beauftragen müssen
- **Ein Wissensfundament für Onboarding**, das neue Mitarbeiter:innen in Tagen statt Monaten arbeitsfähig macht
- **Einen Schutz vor Wissensverlust**, der bisher schlicht nicht existierte

### Was das ermöglicht

Die eigentliche Kraft liegt nicht in der Extraktion selbst — sondern in dem, was danach möglich wird:

- **Teams lernen voneinander.** Statt dass jede:r eigene KI-Workflows erfindet, wird das Beste aus allen Erfahrungen sichtbar und teilbar.
- **Prozesse werden schneller.** Wer auf eine fertige SOP zugreifen kann, statt bei Null anzufangen, spart bei jeder Aufgabe Zeit, multipliziert über ein ganzes Team.
- **Entscheidungen werden besser.** Die Muster-Analyse zeigt, auf welcher Basis das Team Entscheidungen trifft — nicht auf Bauchgefühl, sondern auf dokumentierter Erfahrung.
- **Prozessoptimierung wird erst möglich.** Ein undokumentierter Prozess kann nicht analysiert, nicht gemessen und nicht verbessert werden. Erst wenn Workflows als SOPs vorliegen, kann man sie systematisch hinterfragen: Wo sind Engpässe? Welche Schritte sind überflüssig? Wo lohnt sich Automatisierung? Wo ist der human-in-the-loop unbedingt erforderbar.
- **Technologie kann aufgebaut werden.** Nur auf dokumentierten, strukturierten Prozessen lassen sich Automatisierungen, Integrationen und Analytics aufsetzen. Knowledge Extractor schafft das Fundament, auf dem weiterer technologischer Fortschritt stehen kann.

