# 🫧 BubbleButton Component

Reusable, animated circular button with support for toggle state, sounds, icons, accessibility, and custom styles — perfect for fun UI elements!

---

## 🚀 Quick Start

### 1. **Import the component**

```jsx
import BubbleButton from '../components/BubbleButton';
```

### 2. **Use in your page/component**

```jsx
<BubbleButton
  label="Fun"
  ariaLabel="This bubble adds Fun Activities to the list"
  toggle={true}
  zoom="0.5"
  toggleColor="blue"
  defaultColor="rgba(255, 0, 0, 0.5)" // red with 50% opacity
  onToggleChange={(state) => console.log("Toggled?", state)}
/>
```

---

## ✅ Props Reference

| Prop             | Type            | Default                           | Description                           |
| ---------------- | --------------- | --------------------------------- | ------------------------------------- |
| `label`          | `string`        | `""`                              | Text shown inside the bubble          |
| `ariaLabel`      | `string`        | `label`                           | Tooltip & screen reader label         |
| `icon`           | `string`        | `null`                            | Path to icon image (SVG/PNG)          |
| `zoom`           | `string/number` | `1`                               | CSS zoom level (e.g., `0.5`)          |
| `toggle`         | `boolean`       | `false`                           | Enables toggle mode                   |
| `toggleColor`    | `string`        | `"red"`                           | Background when toggled               |
| `defaultColor`   | `string`        | `"transparent"`                   | Background when not toggled           |
| `hoverColor`     | `string`        | `rgba(236, 38, 197, 0.856)`       | Background on hover                   |
| `onClick`        | `function`      | `() => {}`                        | Called when clicked                   |
| `onToggleChange` | `function`      | `() => {}`                        | Called with new toggle state          |
| `pointerEvents`  | `string`        | `"auto"`                          | Useful for disabling (e.g., `"none"`) |
| `disabled`       | `boolean`       | `false`                           | Prevents interaction                  |
| `clickSound`     | `string`        | bubble pop sound (default path)   | Sound played on click                 |
| `hoverSound`     | `string`        | bubble hover sound (default path) | Sound played on hover                 |
| `isToggled`      | `boolean`       | *Uncontrolled unless set*         | External toggle state                 |
| `setIsToggled`   | `function`      | *Uncontrolled unless set*         | External toggle setter                |

---

## 🔁 Controlled vs Uncontrolled Toggle

### Controlled

```jsx
const [isOn, setIsOn] = useState(true);

<BubbleButton
  toggle={true}
  isToggled={isOn}
  setIsToggled={setIsOn}
/>
```

### Uncontrolled

Let the component manage toggle state internally:

```jsx
<BubbleButton
  toggle={true}
  onToggleChange={(newState) => console.log(newState)}
/>
```

---

## 🎨 Transparent Color Cheat Sheet

| Description       | `defaultColor` value         |
| ----------------- | ---------------------------- |
| Fully Transparent | `"transparent"`              |
| Red 50% opacity   | `"rgba(255, 0, 0, 0.5)"`     |
| Blue 30% opacity  | `"rgba(0, 0, 255, 0.3)"`     |
| White 80% opacity | `"rgba(255, 255, 255, 0.8)"` |
| Pink glow, soft   | `"rgba(255, 20, 147, 0.4)"`  |
| Hex Red 50%       | `"#ff000080"`                |

---

## 🖼 Icons

```jsx
<BubbleButton
  label="Bucket"
  icon="/assets/icons/bucket.svg"
/>
```

Make sure to style icons with this CSS (already in the component):

```css
.bubble-icon {
  width: 40%;
  height: 40%;
  object-fit: contain;
  z-index: 25;
  pointer-events: none;
  position: absolute;
}
```

---

## 🧹 Styling Notes

* `defaultColor` now only affects the **bubble background**, not the glowing `span` effects.
* `hoverColor` is passed in as a custom CSS variable `--hover-bg`.
* The glowing spans remain visually unaffected by background transparency.

---

## 🔊 Sound Notes

You can replace the default sound paths:

```jsx
<BubbleButton
  clickSound="/sounds/my-custom-pop.mp3"
  hoverSound="/sounds/hover.mp3"
/>
```

---

## ♿ Accessibility

* `ariaLabel` is used for screen readers and also as a tooltip (`title`).
* Set it manually for better descriptive accessibility.


