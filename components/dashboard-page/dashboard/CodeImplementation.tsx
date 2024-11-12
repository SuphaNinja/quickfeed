"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function CodeImplementation() {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: "Copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy text",
      });
    }
  };

  return (
    <Card className="w-full  bg-zinc-950 text-white border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Widget & API Overview <span className="text-yellow-400">🔥</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">
            paste the script tag in your &lt;head&gt; tag
          </p>
          <div className="flex items-center gap-2 bg-zinc-900  p-3 rounded-md">
          <pre className="  rounded-md overflow-x-auto">
              <code>{`
<my-widget project=""></my-widget>
<script src=""></script>
              `}</code>
            </pre>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() =>
                copyToClipboard(
                  ` <my-widget project="cm2yp2yp600028iy9zqhe47nx"></my-widget> \n
              <Script src="https://quickfeedwidgetlight.netlify.app/widget.js"/>`
                )
              }
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">
            Get access to all your feedback data
          </p>
          <div className="flex items-center gap-2 bg-zinc-900 p-3 rounded-md">
            <code className="text-sm flex-1">
              https://quickfeed.tech/api/feedbacks/41
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() =>
                copyToClipboard("https://quickfeed.tech/api/feedbacks/41")
              }
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
