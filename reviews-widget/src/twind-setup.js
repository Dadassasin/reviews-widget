// twind-setup.js
import { create, cssomSheet }   from 'twind'
import presetTailwind          from '@twind/preset-tailwind'
import presetAutoprefix        from '@twind/preset-autoprefix'
import * as colors             from 'twind/colors'

export const sheet = cssomSheet({ target: new CSSStyleSheet() })

export const { tw, setup } = create({
  sheet,
  presets: [
    // 1) автопрефиксер для вендорных префиксов
    presetAutoprefix(),
    // 2) сам Tailwind (включая Preflight)
    presetTailwind(),
  ],
  theme: {
    // если нужно расширить палитру по умолчанию
    extend: { colors },
  },
})

setup()
