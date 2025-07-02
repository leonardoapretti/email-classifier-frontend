"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

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
      const hasFile = !!data.emailFile;
      return hasText || hasFile;
    },
    {
      message: "Você deve fornecer um texto ou fazer upload de um arquivo",
      path: ["emailText"],
    }
  );

interface EmailResultDTO {
  categoria: string;
  resposta: string;
  error?: string;
}

export function EmailForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailResultDTO | null>(null);

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
      //...
    } finally {
      setLoading(false);
    }
  }

  const copyResponse = async () => {
    if (result?.resposta) {
      try {
        await navigator.clipboard.writeText(result.resposta);
        alert("Resposta copiada para a área de transferência!");
      } catch (error) {
        alert("Erro ao copiar resposta" + error);
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
            {result.error ? (
              <Alert variant="destructive">
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            ) : (
              <>
                <div>
                  <h4 className="font-semibold mb-2">
                    Categoria:{" "}
                    <span
                      className={
                        result.categoria === "Produtivo"
                          ? "text-green-600"
                          : "text-gray-600"
                      }
                    >
                      {result.categoria === "Produtivo" ? "✅" : "ℹ️"}{" "}
                      {result.categoria}
                    </span>
                  </h4>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">💬 Resposta Sugerida:</h5>
                  <Alert>
                    <AlertDescription>{result.resposta}</AlertDescription>
                  </Alert>
                </div>

                <Button variant="outline" onClick={copyResponse}>
                  📋 Copiar Resposta
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
