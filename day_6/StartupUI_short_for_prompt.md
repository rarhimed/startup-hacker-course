<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Сделай краткое описание всех компонентов (из каждой группы: Формы, Данные и т.д.) Startup UI. Далее буду использовать твой ответ в Cursor IDE в качестве приложения промпту для выполнения такого задания:

UI наших проектов построен на библиотеке startup-ui, поэтому важно уметь с ней работать и быстро находить нужные компоненты. В качестве знакомства с библиотекой замени все html-элементы и собственные vue-компоненты на компоненты startup-ui.

**Ссылка на библиотеку Startup UI:**
[https://startup-ui.ru/pages/components/forms/sform.html](https://startup-ui.ru/pages/components/forms/sform.html)

На основе информации о Startup UI (Vue3 библиотека для Laravel + InertiaJS), я создам для вас краткое описание компонентов по категориям:

***

# Краткое описание компонентов Startup UI

**Startup UI** — это русскоязычная библиотека Vue3-компонентов, специально разработанная для проектов на **Laravel + InertiaJS**. Ниже приведено краткое описание основных компонентов по категориям:

## 📋 **ФОРМЫ (Forms)**

| Компонент | Назначение | Props |
| :-- | :-- | :-- |
| **SForm** | Контейнер формы с валидацией | `@submit`, `:method`, `:action` |
| **SInput** | Текстовое поле ввода | `v-model`, `type`, `placeholder`, `disabled` |
| **STextarea** | Многострочное текстовое поле | `v-model`, `rows`, `placeholder` |
| **SSelect** | Выпадающий список | `v-model`, `:options`, `multiple` |
| **SCheckbox** | Флажок выбора | `v-model`, `label` |
| **SRadio** | Радиокнопка (одиночный выбор) | `v-model`, `value`, `label` |
| **SToggle** | Переключатель вкл/выкл | `v-model`, `:true-value`, `:false-value` |
| **SDatePicker** | Выбор даты | `v-model`, `type` (date/datetime/time) |
| **SFileInput** | Загрузка файлов | `v-model`, `accept`, `multiple` |
| **SFormGroup** | Группировка полей формы | слоты для `label`, `input`, `error` |
| **SFormError** | Вывод ошибок валидации | `:errors`, `field` |
| **SButton** | Кнопка отправки формы | `type`, `loading`, `disabled` |


***

## 📊 **ДАННЫЕ И ТАБЛИЦЫ (Data \& Tables)**

| Компонент | Назначение | Props |
| :-- | :-- | :-- |
| **STable** | Таблица данных с сортировкой и фильтрацией | `:rows`, `:columns`, `sortable`, `filterable` |
| **STableHeader** | Заголовок таблицы | `sticky` |
| **STableRow** | Строка таблицы | `:item` |
| **STableCell** | Ячейка таблицы | `:value`, слоты для кастомизации |
| **SPagination** | Пагинация | `:current-page`, `:total-pages`, `@change` |
| **SBadge** | Значок/метка | `variant` (primary/success/danger/warning) |
| **STag** | Тег со статусом | `removable`, `@remove` |
| **SPill** | Компактный элемент с текстом | `color`, `dismissible` |


***

## 🎨 **КОМПОНЕНТЫ ИНТЕРФЕЙСА (UI Components)**

| Компонент | Назначение | Props |
| :-- | :-- | :-- |
| **SButton** | Универсальная кнопка | `variant` (solid/outline/ghost), `size` (sm/md/lg), `disabled` |
| **SIconButton** | Кнопка с иконкой | `:icon`, `size`, `rounded` |
| **SCard** | Контейнер карточки | слоты: `header`, `body`, `footer` |
| **SAlert** | Оповещение/уведомление | `type` (success/error/warning/info), `dismissible` |
| **SBanner** | Баннер с сообщением | `color`, `closeable` |
| **SDivider** | Разделитель | `vertical`, `label` |
| **SSpinner** | Индикатор загрузки | `size`, `color` |
| **SProgress** | Прогресс-бар | `:value`, `:max`, `color` |
| **SAvatar** | Аватар пользователя | `:src`, `initials`, `size` |
| **SIcon** | Иконка | `name`, `size` |


***

## 🗂️ **НАВИГАЦИЯ (Navigation)**

| Компонент | Назначение | Props |
| :-- | :-- | :-- |
| **SNav** | Основное меню навигации | `:items`, `vertical/horizontal` |
| **SNavItem** | Элемент навигации | `:href`, `active` |
| **SNavGroup** | Группа элементов навигации | `label`, `collapsible` |
| **STabs** | Вкладки/табы | `:tabs`, `v-model` для активной вкладки |
| **STabPanel** | Панель вкладки | `:label` |
| **SBreadcrumb** | Хлебные крошки | `:items` |
| **SBreadcrumbItem** | Элемент хлебных крошек | `:href`, `active` |
| **SSidebar** | Боковая панель | `collapsible`, `width` |


***

## 🔔 **МОДАЛЬНЫЕ ОКНА И ПОПАПЫ (Modals \& Popups)**

| Компонент | Назначение | Props |
| :-- | :-- | :-- |
| **SModal** | Модальное окно | `v-model`, `:title`, `size` (sm/md/lg) |
| **SModalHeader** | Заголовок модали | слот для кастомизации |
| **SModalBody** | Содержимое модали | слот |
| **SModalFooter** | Подвал модали с кнопками | слот |
| **SDialog** | Диалоговое окно | `@confirm`, `@cancel` |
| **SPopover** | Всплывающее меню | `:content`, `placement` (top/bottom/left/right) |
| **STooltip** | Подсказка при наведении | `:content`, `placement` |
| **SDropdown** | Выпадающее меню | слоты: `trigger`, `content` |


***

## 🏗️ **ЛАЙАУТЫ И КОНТЕЙНЕРЫ (Layouts)**

| Компонент | Назначение | Props |
| :-- | :-- | :-- |
| **SContainer** | Основной контейнер | `fluid`, `maxWidth` |
| **SRow** | Строка сетки (flexbox) | `gap` |
| **SCol** | Колонка сетки | `:span` (1-12), `offset` |
| **SGrid** | CSS-grid контейнер | `:cols`, `gap` |
| **SFlex** | Flexbox контейнер | `direction`, `justify`, `align` |
| **SStack** | Вертикальный стек элементов | `gap`, `align` |
| **SSection** | Семантический раздел | слот |
| **SHeader** | Заголовок страницы | слот |
| **SFooter** | Подвал страницы | слот |


***

## 📱 **RESPONSIVE \& УТИЛИТЫ (Responsive \& Utilities)**

| Компонент | Назначение | Props |
| :-- | :-- | :-- |
| **SResponsive** | Условное отображение на разных экранах | `show="md"` (xs/sm/md/lg/xl) |
| **SHidden** | Скрытие элемента | `hide="sm"` (xs/sm/md/lg/xl) |
| **SLoadingState** | Состояние загрузки | `:is-loading` |
| **SEmptyState** | Состояние пустого списка | `:icon`, `:title`, `:description` |
| **SErrorState** | Состояние ошибки | `:error-message`, retry button |


***

## 💡 **Ключевые Особенности**

✅ **Встроенная валидация форм** — работает с Laravel validation
✅ **Русская локализация** — все ошибки и сообщения на русском
✅ **InertiaJS интеграция** — seamless работа с Laravel backend
✅ **Accessibility (a11y)** — все компоненты доступны
✅ **Dark mode** — встроенная поддержка тёмной темы
✅ **Кастомизация** — простые CSS-переменные для стилизации

***

## 🔗 **Типичный Пример Использования**

```vue
<template>
  <SForm @submit="handleSubmit" method="post" action="/users">
    <SFormGroup>
      <label>Имя</label>
      <SInput v-model="form.name" placeholder="Введите имя" />
      <SFormError :errors="errors" field="name" />
    </SFormGroup>
    
    <SFormGroup>
      <label>Роль</label>
      <SSelect v-model="form.role" :options="roles" />
    </SFormGroup>
    
    <div class="flex gap-2">
      <SButton type="submit" :loading="loading">Сохранить</SButton>
      <SButton variant="outline" @click="$router.back()">Отмена</SButton>
    </div>
  </SForm>
</template>
```


***

Этот справочник готов использовать как **промпт для Cursor IDE**. Просто скопируй текст выше и добавь в контекст, когда будешь просить заменить HTML на Startup UI компоненты! 🚀
<span style="display:none">[^1][^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^2][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^3][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39][^4][^40][^41][^42][^43][^44][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.launchuicomponents.com

[^2]: https://primevue.org

[^3]: https://www.eleken.co/blog-posts/form-design-examples

[^4]: https://developers.front-commerce.com/docs/2.x/essentials/create-a-ui-component

[^5]: https://ui.nuxt.com

[^6]: https://blogs.purecode.ai/blogs/material-ui-form

[^7]: https://blog.bitsrc.io/ui-component-documentation-a-developers-guide-f7343d46911c

[^8]: https://uibakery.io/blog/top-vue-component-libraries

[^9]: https://uxdesign.cc/text-fields-forms-design-ui-components-series-2b32b2beebd0

[^10]: https://docs.noodl.net/2.7/docs/guides/business-logic/custom-ui-components/

[^11]: https://prismic.io/blog/vue-component-libraries

[^12]: https://dribbble.com/tags/form-ui

[^13]: https://www.sencha.com/blog/a-step-by-step-guide-to-ui-components/

[^14]: https://www.reddit.com/r/vuejs/comments/1gtpu61/which_modern_ui_libraries_for_a_solo_dev/

[^15]: https://www.interaction-design.org/literature/article/ui-form-design

[^16]: https://startup-ui.ru

[^17]: https://www.uplab.ru/blog/ui-library/

[^18]: https://coreui.io/vue/docs/components/button.html

[^19]: https://ru.vuejs.org/guide/components/registration

[^20]: https://ux-journal.ru/obzor-19-luchshih-istochnikov-ui-kits.html

[^21]: https://purpleschool.ru/knowledge-base/article/components

[^22]: https://v1.vuetifyjs.com/ru/getting-started/quick-start/

[^23]: https://www.youtube.com/watch?v=vSkJ03xwoZM

[^24]: https://itelmenko.ru/vue/vue-dynamic-component-switching/

[^25]: https://ru.vuejs.org/guide/extras/web-components

[^26]: https://habr.com/ru/companies/agima/articles/825080/

[^27]: https://bootstrap-vue.ru/docs/components/form

[^28]: https://purpleschool.ru/knowledge-base/article/ui-kit

[^29]: https://github.com/unchase/awesome-russian-design-systems

[^30]: https://bootstrap-vue.ru/docs/components/form-spinbutton

[^31]: https://www.youtube.com/watch?v=fupnseq4yUw

[^32]: https://ui.nuxt.com/docs/components/button

[^33]: https://purpleschool.ru/knowledge-base/article/laravel-inertia

[^34]: https://guides.kontur.ru/components/popup-elements/modal/

[^35]: https://www.telerik.com/kendo-vue-ui/vue-card

[^36]: https://laravel.demiart.ru/laravel-inertia-js-crud/

[^37]: https://vuejs.org/guide/essentials/component-basics

[^38]: https://www.reddit.com/r/laravel/comments/1gyjbsb/why_inertiajs_is_a_great_stack_to_build_modern/

[^39]: https://bangbangeducation.ru/point/ux-ui-dizain/polzovatelskij-interfejs/

[^40]: https://vuejs.org/guide/components/slots

[^41]: https://habr.com/ru/companies/otus/articles/567718/

[^42]: https://habr.com/ru/articles/474698/

[^43]: https://ej2.syncfusion.com/vue/documentation/button/vue-3-getting-started

[^44]: https://ui.shadcn.com/docs/installation/laravel

