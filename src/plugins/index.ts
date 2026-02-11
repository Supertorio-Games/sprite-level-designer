/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createI18n } from "vue-i18n";


// Types
import type { App } from 'vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// TODO: Externalize Messages
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      navigation: {
        title: 'Kaplayer - Sprite Level Designer',
        toCodeDisplay: 'Display Code',
        toMapEditor: 'Edit Map',
        tabKaplay: 'Kaplay.JS',
        tabPhaser: 'Phaser.JS',
        actionAddSpriteSheet: 'Add Sprite Sheet',
        btnCancel: 'Cancel',
      },
      settings: {
        layers: 'Layers',
        mapConfig: 'Map Configuration',
        mapScale: 'Map Scale',
        enableGridLines: 'Enable Grid Lines',
        backgroundColor: 'Background Color',
        gridLinesColor: 'Grid Line Color',
        cellSize: 'Base Cell Size',
        spritePath: 'Sprite Path',
        methodPrefix: 'Method Prefix',
        kaplayMethodPlaceholder: 'kaplay',
        mapWidth: 'Map Width',
        mapHeight: 'Map Height',
      },
      tools: {
        selectModeToolTip: 'Select (s)',
        brushModeToolTip: 'Brush (b)',
        eyedropperToolTip: 'Eyedropper (I)',
        eraserToolTip: 'Erase (e)',
        fillSelectionToolTip: 'Fill Selection (f)',
        clearSelectionToolTip: 'Clear Selection (x)',
        mapSizeLabel: 'Map Size:',
        mapSizeDimensionsSeparator: 'X',
      },
      spriteIngestForm: {
        title: 'Add New Sprite Sheet',
        sheetFileLabel: 'Sprite Sheet',
        configFileLabel: 'Sheet Config XML',
        loadSubmitButton: 'Load Sprite Sheet',
      },
      spriteInfo: {
        details: 'More Details',
        width: 'Width: {value}px',
        height: 'Height: {value}px',
        posX: 'Pos X: {value}px',
        posY: 'Pos Y: {value}px',
        hasCollisions: 'Has Collisions',
        hasPhysics: 'Has Physics',
        isStatic: 'Is Static',
        tags: 'Tags',
      },
      message: {
        addSpriteSheet: 'Add a Sprite Sheet',
        removeSpriteSheetTitle: 'Are you sure?',
        removeSpriteSheetMessage: 'The sprite sheet will be deleted and these sprites will be removed from the map.',
        removeSpriteSheetAction: 'Remove Sprite Sheet',
      },
      misc: {
        phaserComingSoon: '"// Phaser Code Coming Soon"',
        btnClose: "Close",
      }
    }
  }
})

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(pinia)
    .use(router)
    .use(i18n)
}
