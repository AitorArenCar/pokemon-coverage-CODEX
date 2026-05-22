# Randomlocke Team Analyzer

Web estatica para analizar equipos Pokemon de randomlocke con combinaciones ilegales o randomizadas. Esta pensada para GitHub Pages y funciona sin backend ni base de datos.

No calcula daño, stats, EVs, IVs ni HP. Solo analiza tipos, debilidades, resistencias, inmunidades, cobertura ofensiva y algunas reglas especiales de habilidades o movimientos.

Este proyecto tambien sirve como prueba practica para testear los limites y capacidades de Codex trabajando dentro de Visual Studio Code, especialmente en generacion de proyectos, refactorizacion, verificacion con npm y preparacion de despliegues estaticos.

## Funciones

- Editor de 6 slots con Pokemon, habilidad, objeto y 4 movimientos.
- Importacion y exportacion en formato Showdown.
- Autocompletado global con datos de `pokemon-showdown`.
- No valida legalidad competitiva: cualquier Pokemon puede llevar cualquier habilidad o movimiento.
- Sprites animados de Pokemon Showdown con fallback a sprite estatico de PokeAPI.
- Persistencia automatica en `localStorage`.
- Analisis defensivo por tipo atacante y por miembro del equipo.
- Analisis ofensivo por movimientos no status.
- Soporte MVP para efectos como Levitate, Flash Fire, Water Absorb, Thick Fat, Wonder Guard, Flying Press, Freeze-Dry y Thousand Arrows.

## Instalacion local

```bash
npm install
npm run dev
```

Para generar la version estatica:

```bash
npm run build
```

La carpeta publicada es `dist`.

## Despliegue en GitHub Pages

1. Crea un repositorio en GitHub.
2. Sube este proyecto al repositorio.
3. En GitHub, entra en `Settings > Pages`.
4. En `Build and deployment`, selecciona `GitHub Actions` como source.
5. Haz push a la rama `main`.
6. El workflow `.github/workflows/deploy.yml` instalara dependencias, ejecutara `npm run build` y publicara `dist`.

El workflow define automaticamente:

```yaml
VITE_BASE_PATH: /${{ github.event.repository.name }}/
```

Esto hace que Vite use el nombre real del repositorio durante el despliegue.

## Cambiar `base` en Vite

En `vite.config.ts` hay un fallback local:

```ts
base: process.env.VITE_BASE_PATH ?? '/proyecto2/',
```

Si el repositorio se llama distinto y no usas la variable del workflow, cambia `'/proyecto2/'` por:

```ts
base: '/NOMBRE_DEL_REPO/',
```

Si despliegas en un dominio propio o en un repositorio de usuario/organizacion en la raiz, usa:

```ts
base: '/',
```

## Ejemplo de importacion

```txt
Pikachu @ Leftovers
Ability: Levitate
Tera Type: Electric
EVs: 252 HP / 252 Atk / 4 Spe
Adamant Nature
- Earthquake
- Flying Press
- Thunderbolt
- Ice Beam

Charizard-Mega-X
Ability: Water Absorb
- Flamethrower
- Dragon Claw
- Roost
- Solar Beam
```

El parser importa Pokemon, objeto, habilidad y movimientos. Ignora EVs, IVs, naturaleza, Tera Type y otras lineas no necesarias.

## Alias en español incluidos

Algunos alias aceptados:

- Levitacion -> Levitate
- Absorbe Fuego -> Flash Fire
- Absorbe Agua -> Water Absorb
- Herbivoro -> Sap Sipper
- Absorbe Electricidad -> Volt Absorb
- Pararrayos -> Lightning Rod
- Sebo -> Thick Fat
- Superguarda -> Wonder Guard
- Plancha Voladora -> Flying Press
- Liofilizacion -> Freeze-Dry
- Mil Flechas -> Thousand Arrows

Internamente se guardan nombres en ingles.

## Limitaciones conocidas

- No calcula dano final ni estadisticas.
- No modela objetos, clima, terrenos, habilidades no listadas ni interacciones competitivas completas.
- Wonder Guard se implementa de forma simple: convierte a 0x todo ataque con multiplicador defensivo menor o igual a 1x.
- Filter, Solid Rock y Prism Armor reducen tipos superefectivos multiplicando por 0.75, por lo que pueden aparecer valores como 1.5x o 3x.
- Thousand Arrows muestra una nota y solo elimina la inmunidad simple de Flying en la cobertura basica.
- Si `pokemon-showdown` diera problemas de compatibilidad o tamano de bundle, la capa `src/lib/dex.ts` permite sustituirlo por JSON estatico generado en build time sin tocar los componentes.
