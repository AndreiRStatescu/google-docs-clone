export const CONTENT_BLANK = "";

export const CONTENT_MARKDOWN = `# Welcome to the Markdown Demo

This demo showcases **bidirectional** markdown support in Tiptap with extended features.

## Features

- **Bold text** and *italic text*
- \`inline code\` and code blocks
- [Links](https://tiptap.dev)
- Lists and more!

## Extended Features

## Task Lists

- [ ] Incomplete task
  - [ ] Nested incomplete task
  - [x] Completed task
- [x] Completed task
  - [ ] Incomplete task
  - [x] Completed task

<h2>HTML Support</h2>

<p>Markdown support comes with additional HTML support so your content can be easily parsed as well, even if not in Markdown format.</p>

<ul>
  <li>
    <p>
      <strong>Lists</strong>
    </p>
  </li>
  <li>
    <p>and</p>
  </li>
  <li>
    <p>Sublists</p>
    <ul>
      <li>
        <p>See?</p>
      </li>
    </ul>
  </li>
</ul>

### Code

Tiptap supports \`inline code\` and full code blocks:

\`\`\`javascript
import { Editor } from '@tiptap/core'
import { StarterKit } from '@tiptap/starter-kit'

const editor = new Editor({
  extensions: [StarterKit],
  content: '<p>Hello World!</p>',
  element: document.querySelector('#editor'),
})
\`\`\`

### Details

:::details

:::detailsSummary
What features does Tiptap offer?
:::

:::detailsContent

- Rich Text Editing
- Collaborative Editing
- Markdown Support
- Content AI
- Custom Extensions
- More...

:::

:::

:::details

:::detailsSummary
Where can I learn how to use Tiptap?
:::

:::detailsContent

You can learn how to use Tiptap by visiting the [official documentation](https://tiptap.dev/docs).

:::

:::

### YouTube Videos

:::youtube {src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" start="0" width="400" height="300"} :::

### Images

![Random Image](https://unsplash.it/400/600 "Tiptap Editor")

### Mentions

Hey, [@ id="madonna" label="Madonna"], have you seen [@ id="tom-cruise" label="Tom Cruise"]?

### Mathematics

Inline math: $E = mc^2$ and $\\pi r^2$

Block math:

$$
40*5/38
$$

### Custom React Component

:::react {content="This is a custom React node view with fenced syntax!"}

Isn't this great?

:::

:::react {content="Here is another custom React node view with more content!"}

Another one with even more inline content to **edit**!

:::react {content="Nested node"}

Nested content is also supported!

:::

:::

### Try editing the markdown on the left:

1. Edit the markdown text
2. Click "Parse Markdown"
3. See it render in the editor!
  1. Be very happy
  2. Enjoy the parsed content
4. Try adding YouTube videos, mentions, math expressions, and custom components directly in the editor
5. Click "Extract Markdown" to see the serialized output
  1. Be amazed by the fidelity of the conversion
  2. Share your feedback!

You can also edit in the editor and see the markdown update.`;

export const CONTENT_BUSINESS_LETTER = `
      <h2>YOUR COMPANY</h2>
      <p>123 YOUR STREET</p>
      <p>YOUR CITY, ST 12345</p>
      <p>(123) 456-7890</p>
      <p>MYEMAIL@EXAMPLE.COM</p>
      <p></p>
      <p>September 24, 20XX</p>
      <p></p>
      <p></p>
      <p>Dear Ms. Reader,</p>
      <p></p>
      <p>Thank you for your interest in our services.</p>
      <p></p>
      <p>We are pleased to provide you with our latest product offerings.</p>
      <p></p>
      <p>Our team has extensive experience in business solutions.</p>
      <p></p>
      <p>We look forward to discussing this opportunity further.</p>
      <p></p>
      <p>Please contact us if you have any questions.</p>
      <p></p>
      <p></p>
      <p>Sincerely,</p>
      <p></p>
      <p></p>
      <p></p>
      <p><strong>YOUR NAME</strong></p>
    `;

export const CONTENT_COVER_LETTER = `
      <h2>Your Name</h2>
      <p>123 Your Street</p>
      <p>Your City, ST 12345</p>
      <p>phone: (555) 555-5555</p>
      <p>email: your.email@example.com</p>
      <p></p>
      <p>September 24, 2024</p>
      <p></p>
      <p></p>
      <p>Hiring Manager</p>
      <p>Company Name</p>
      <p>123 Company Street</p>
      <p>Company City, ST 12345</p>
      <p></p>
      <p></p>
      <p>Dear Hiring Manager,</p>
      <p></p>
      <p>I am writing to express my strong interest in the position at your company. With my background and experience, I believe I would be an excellent fit for your team.</p>
      <p></p>
      <p>Throughout my career, I have developed strong skills that align perfectly with the requirements of this role. I am confident that my expertise would contribute significantly to your organization.</p>
      <p></p>
      <p>I am particularly drawn to your company because of its reputation for excellence and innovation. I would welcome the opportunity to bring my skills and enthusiasm to your team.</p>
      <p></p>
      <p>Thank you for considering my application. I look forward to discussing how I can contribute to your organization's success.</p>
      <p></p>
      <p></p>
      <p>Sincerely,</p>
      <p></p>
      <p></p>
      <p>Your Name</p>
    `;

export const CONTENT_LETTER = `
      <h2>Your Band</h2>
      <p><strong style="color: #ff4444;">September 24, 20XX</strong></p>
      <p></p>
      <h1>Hello fan,</h1>
      <p></p>
      <h3>First, a big thank you!</h3>
      <p></p>
      <p>Thanks for being such an amazing supporter of our music.</p>
      <p></p>
      <p>We're excited to announce our new album is coming soon.</p>
      <p></p>
      <p>You'll be the first to hear our latest singles.</p>
      <p></p>
      <p>We're planning something special for our loyal fans.</p>
      <p></p>
      <p>Stay tuned for exclusive content and updates.</p>
      <p></p>
      <p>Can't wait to see you at our next show.</p>
      <p></p>
      <p></p>
      <p></p>
      <p>Lots of love,</p>
      <p></p>
      <p></p>
      <p>Your Name</p>
    `;

export const CONTENT_PROJECT_PROPOSAL = `
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <h1>Project Name</h1>
      <p></p>
      <p>09.04.20XX</p>
      <p></p>
      <p></p>
      <p>Your Name</p>
      <p>Your Company</p>
      <p>123 Your Street</p>
      <p>Your City, ST 12345</p>
    `;

export const CONTENT_RESUME = `
      <p><strong style="color: #FF0000;">Hello,</strong></p>
      <h2>I'm Your Name</h2>
      <p></p>
      <p>123 YOUR STREET</p>
      <p>YOUR CITY, ST 12345</p>
      <p>TEL: 555.555.5555</p>
      <p>YOU.REPLY@EXAMPLE.COM</p>
      <p></p>
      <p></p>
      <h3 style="color: #FF0000;">Skills</h3>
      <p>Skills description here. Core competencies and key abilities.</p>
      <p></p>
      <p></p>
      <h3 style="color: #FF0000;">Experience</h3>
      <p></p>
      <p><small>MONTH 20XX – MONTH 20YY</small></p>
      <p><strong>Company Name, Location</strong> — Job Title</p>
      <ul>
        <li>Key responsibility or achievement</li>
      </ul>
      <p></p>
      <p></p>
      <p></p>
      <h3 style="color: #FF0000;">Education</h3>
      <p></p>
      <p><strong>College Name, Location — Degree</strong></p>
      <p></p>
      <p></p>
      <h3 style="color: #FF0000;">Awards</h3>
      <p>Notable achievement or recognition.</p>
    `;

export const CONTENT_SOFTWARE_PROPOSAL = `
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <h1>SOFTWARE</h1>
      <h1>DEVELOPMENT</h1>
      <h1>PROPOSAL</h1>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p><strong>PREPARED FOR</strong></p>
      <p>Client's name</p>
      <p>Client's company name</p>
      <p></p>
      <p><strong>PREPARED BY</strong></p>
      <p>Your name</p>
      <p>Your company name</p>
    `;
