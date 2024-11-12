// types.d.ts or global.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    "my-widget": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & { project: string };
  }
  interface IntrinsicElements {
    "stripe-pricing-table": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >
  }
}