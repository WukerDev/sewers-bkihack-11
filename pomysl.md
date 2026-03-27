# Sewers
**Pospolite Ruszenie Obliczeniowe: Rozproszona infrastruktura AI dla polskiego biznesu.**

Sewers to platforma B2B działająca w modelu IaaS/SaaS, która agreguje uśpioną moc obliczeniową polskich małych i średnich przedsiębiorstw (MŚP) i udostępnia ją w bezpiecznym modelu rozproszonym (Mesh) do zadań takich jak fine-tuning modeli oraz hostowanie Agentów AI.

---

## 🇵🇱 Wizja Rozwoju Polski 2036
Polska gospodarka nie musi być tylko konsumentem zagranicznych usług chmurowych. Nasz projekt rozwiązuje trzy kluczowe problemy najbliższej dekady:
* **Zatrzymanie kapitału:** Środki wydawane dziś na zagraniczne chmury zostają w polskim obiegu B2B.
* **Demokratyzacja AI:** Polskie start-upy zyskują dostęp do ułamka kosztów fine-tuningu, co obniża próg wejścia do tworzenia innowacji.
* **Utylizacja sprzętu:** Tysiące potężnych stacji roboczych w pracowniach architektonicznych i software house'ach nie stoją w nocy odłogiem.

---

## 🏗️ Architektura Systemu

System opiera się na topologii gwiazdy z bezpiecznym tunelowaniem, gdzie centralny Orchestrator zarządza siecią rozproszonych węzłów dostawców.

### 1. Główny Serwer Zarządzający (Brain)
Mózg operacji, hostowany po naszej stronie. 
* Odbiera zlecenia od klientów przez API.
* Analizuje zapotrzebowanie (VRAM, TFLOPS) i realizuje matchmaking z dostępnymi węzłami.
* Monitoruje telemetrię i zarządza systemem rozliczeń bilingowych (Pay-as-you-go).

### 2. Węzeł Dostawcy (Docker Node)
Bezobsługowy pakiet wdrożeniowy dla firmy udostępniającej sprzęt.
* Uruchamiany jako pojedynczy kontener.
* Automatycznie autoryzuje się w sieci Gniazda.
* Jest całkowicie odizolowany od sieci lokalnej dostawcy dla maksymalnego bezpieczeństwa.

### 3. Moduł Agentów AI na Żądanie
Umożliwiamy nie tylko zadania jednorazowe (fine-tuning), ale i ciągłe. Klienci mogą wykupić stałego Agenta AI (np. asystenta bazy wiedzy), który fizycznie rezyduje na wydzielonym węźle dostawcy, generując stały dochód (MRR).

---

## 🛡️ Bezpieczeństwo i Niezawodność

* **Fault Tolerance:** W przypadku odłączenia zasilania przez dostawcę w trakcie fine-tuningu, Orchestrator ładuje ostatni checkpoint i płynnie przerzuca zadanie na inny węzeł w sieci.
* **Mesh VPN:** Wszystkie węzły komunikują się z centralą wyłącznie przez bezpieczne, szyfrowane tunele (np. WireGuard), bez wystawiania publicznych portów.
* **Dowód Pracy (Proof of Compute):** Wbudowane mechanizmy walidacji krzyżowej gwarantują, że dostawca sprzętu rzeczywiście przetworzył dane i wygenerował wagi modelu.

---

## 🚀 Szybki Start (Dostawca Mocy)

Aby podłączyć swój serwer do Sewers i zacząć zarabiać, wystarczy pobrać nasz kontener i podać klucz autoryzacyjny.

```bash
docker pull gniazdoai/worker-node:latest

docker run -d \
  --name sewers \
  --gpus all \
  -e API_KEY="twoj_unikalny_klucz_b2b" \
  -e ORCHESTRATOR_URL="[https://api.gniazdo.ai](https://api.gniazdo.ai)" \
  gniazdoai/worker-node:latest