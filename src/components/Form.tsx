"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z
  .object({
    emailText: z.string().optional().or(z.literal("")),
    emailFile: z.instanceof(File).optional(),
  })
  .refine(
    (data) => {
      const hasText = !!data.emailText && data.emailText.trim() !== "";
      const hasFile = data.emailFile instanceof File;
      return hasText || hasFile;
    },
    {
      message: "Você deve fornecer um texto ou fazer upload de um arquivo",
      path: ["emailText"],
    }
  );

// Interface atualizada para corresponder à resposta da API
interface ProcessEmailResponse {
  success: boolean;
  text: string;
  classification: {
    category: string;
    is_productive: boolean;
  };
  response: {
    generated: boolean;
    message: string;
    text: string | null;
  };
  timestamp: string;
}

export function EmailForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessEmailResponse | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailText: "",
    },
  });

  async function onSubmit() {
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      const emailText = form.getValues("emailText");
      const emailFile = form.getValues("emailFile");

      if (emailText) {
        formData.append("email_text", emailText);
      }
      if (emailFile) {
        formData.append("email_file", emailFile);
      }

      const response = await fetch(
        "https://email-classifier-backend-ia98.onrender.com/process_email",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setResult(data as ProcessEmailResponse);
      form.reset();
    } catch (error) {
      // Trate o erro se necessário
    } finally {
      setLoading(false);
    }
  }

  const copyResponse = async () => {
    if (result?.response?.text) {
      try {
        await navigator.clipboard.writeText(result.response.text);
        toast.success("Resposta copiada para a área de transferência!", {
          duration: 2000,
        });
      } catch (error) {
        toast.error("Erro ao copiar resposta: " + error, {
          duration: 2000,
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Classificador Inteligente de Emails
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="emailFile"
                render={({ field: { onChange, name, onBlur, ref } }) => (
                  <FormItem>
                    <FormLabel>📎 Upload de Email (.txt ou .pdf)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".txt,.pdf"
                        disabled={loading}
                        name={name}
                        ref={ref}
                        onBlur={onBlur}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escreva ou cole o texto do email</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Cole aqui o conteúdo do email para análise..."
                        rows={6}
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processando..." : "Processar Email"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Processando email...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado da Análise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!result.success ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Erro ao processar o email. Tente novamente.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div>
                  <h4 className="font-semibold mb-2">
                    Categoria:{" "}
                    <span
                      className={
                        result.classification.category === "Produtivo"
                          ? "text-green-600"
                          : "text-gray-600"
                      }
                    >
                      {result.classification.is_productive ? "✅" : "ℹ️"}{" "}
                      {result.classification.category}
                    </span>
                  </h4>
                </div>

                {result.response.text && (
                  <div>
                    <h5 className="font-semibold mb-2">
                      💬 Resposta Sugerida:
                    </h5>
                    <Alert>
                      <AlertDescription>
                        {result.response.text}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {result.response.text && (
                  <Button variant="outline" onClick={copyResponse}>
                    📋 Copiar Resposta
                  </Button>
                )}

                {!result.response.generated && (
                  <Alert>
                    <AlertDescription>
                      {result.response.message}
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
