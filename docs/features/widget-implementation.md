# Widget Implementation Guide

## Overview
The FeedbackHub widget allows users to embed feedback forms on their websites with a simple script tag.

## Implementation

### 1. Widget Script
Create a JavaScript file that will be loaded on customer websites:

```javascript
// public/widget.js
(function() {
  const script = document.currentScript;
  const formId = script.getAttribute('data-form-id');
  const containerId = script.getAttribute('data-container') || 'feedbackhub-widget';
  
  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = `https://feedbackhub.app/embed/${formId}`;
  iframe.style.width = '100%';
  iframe.style.height = '400px';
  iframe.style.border = 'none';
  
  // Insert into container
  const container = document.getElementById(containerId);
  if (container) {
    container.appendChild(iframe);
  }
})();
```

### 2. Embed Route
Create an embed-specific route that renders a minimal UI:

```typescript
// app/embed/[formId]/page.tsx
export default function EmbedForm({ params }: { params: { formId: string } }) {
  // Fetch form data
  // Render minimal feedback form
  // Post responses back to API
}
```

### 3. Usage Example
Customers embed the widget like this:

```html
<div id="feedback-widget"></div>
<script 
  src="https://feedbackhub.app/widget.js" 
  data-form-id="form_abc123"
  data-container="feedback-widget">
</script>
```

### 4. Customization Options
- Custom colors via data attributes
- Position (floating, inline)
- Size (compact, full)
- Language
