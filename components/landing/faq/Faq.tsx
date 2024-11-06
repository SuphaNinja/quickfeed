"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

type FaqDataProps = {
    title: string;
    description: string;
};

const faqData: FaqDataProps[] = [
    {
        title: "Which languages does QuickFeed have support for?",
        description:
            "QuickFeed comes with full multilingual support. Our platform is designed to seamlessly handle multiple languages, ensuring a smooth and accessible experience for everybody in your organisation.",
    },
    {
        title: "Can I try QuickFeed for free?",
        description: "Yes! But with limited use and only one project.",
    },
    {
        title: "How do I connect QuickFeed to my data?",
        description:
            "QuickFeed has connectors for Cloud Data Warehouses BigQuery, Snowflake and RedShift. It even supports SQL databases like MySQL, Postgres and SQL Server out of the box. You set up accounts on your side and decide which data sets QuickFeed should have access to, read-only of course! If you do not have a Data Warehouse in your organisation yet, we can help you out. Our team has streamlined processes for gathering all your data from different sources in a centralized place.",
    },
    {
        title: "How secure is my data with QuickFeed?",
        description:
            "At QuickFeed, data security is our top priority. We employ industry-leading encryption protocols to ensure your data is fully protected during transit. Your business data is retrieved in real-time, and we do not store any copies of it on our servers. QuickFeed can be configured to run in our data centres located in the EU, USA, or Asia.",
    },
    {
        title: "Which AI do you use?",
        description:
            "QuickFeed leverages Large Language Models (LLMs) and is compatible with a range of providers. The choice is yours: opt for OpenAI, Gemini, or elevate your data governance by using one of our open-source LLMs based on Llama and Mistral, hosted securely in our own data centres.",
    },
];

export default function Faq() {
    return (
        <div className="w-full py-16 px-4">
            <h1 className="text-4xl font-bold mb-12">Frequently Asked Questions</h1>
            <Accordion type="single" collapsible className="w-full space-y-4">
                {faqData.map((faq, index) => (
                    <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border dark:border-neutral-800 rounded-lg overflow-hidden transition-all duration-200 dark:hover:border-neutral-700"
                    >
                        <AccordionTrigger className="text-left hover:no-underline p-6 text-lg font-medium">
                            {faq.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-neutral-400 px-6 pb-6 pt-2">
                            <p className="leading-relaxed">{faq.description}</p>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
