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
import { ModeToggle } from "./custom/ThemeToggleBtn";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

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
  const [isFileMode, setIsFileMode] = useState(false);
  const [showFileDisabledModal, setShowFileDisabledModal] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailText: "",
      emailFile: undefined,
    },
  });

  const toggleMode = () => {
    setIsFileMode(!isFileMode);
    form.reset({
      emailText: "",
      emailFile: undefined,
    });
  };

  async function onSubmit() {
    const emailFile = form.getValues("emailFile");
    if (emailFile) {
      setShowFileDisabledModal(true);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      const emailText = form.getValues("emailText");

      if (emailText && emailText.trim() !== "") {
        formData.append("email_text", emailText);
      }

      const response = await fetch(
        "https://email-classifier-backend-ia98.onrender.com/api/process_email/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const data = (await response.json()) as ProcessEmailResponse;
      setResult(data);
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao enviar o formulário"
      );
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
        toast.error(
          error instanceof Error
            ? "Erro ao copiar resposta: " + error.message
            : "Erro ao copiar resposta",
          {
            duration: 2000,
          }
        );
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-center w-full">
              <span className="text-2xl font-bold">
                Classificador Inteligente de Emails
              </span>
              <ModeToggle />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <div className="flex bg-secondary rounded-lg p-1">
              <button
                type="button"
                onClick={() => !isFileMode || toggleMode()}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  !isFileMode
                    ? "bg-card shadow-sm text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ✍️ Texto
              </button>
              <button
                type="button"
                onClick={() => isFileMode || toggleMode()}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  isFileMode
                    ? "bg-card shadow-sm text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                📎 Arquivo
              </button>
            </div>
          </div>

          <div className="relative h-[400px] perspective-1000">
            <div
              className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${
                isFileMode ? "rotate-y-180" : ""
              }`}
            >
              <div className="absolute inset-0 backface-hidden">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 h-full flex flex-col"
                  >
                    <FormField
                      control={form.control}
                      name="emailText"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>
                            Escreva ou cole o texto do email
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Cole aqui o conteúdo do email para análise..."
                              className="h-[280px] resize-none"
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
              </div>

              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 h-full flex flex-col"
                  >
                    <FormField
                      control={form.control}
                      name="emailFile"
                      render={({
                        field: { onChange, value, name, onBlur, ref },
                      }) => (
                        <FormItem className="flex-1">
                          <FormLabel>
                            📎 Upload de Email (.txt ou .pdf)
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-4 h-full">
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
                                className="hidden"
                                id="file-upload"
                              />
                              <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center h-[280px] flex flex-col justify-center items-center cursor-pointer transition-all ${
                                  value
                                    ? "border-primary/50 bg-primary/5"
                                    : "border-border hover:border-input"
                                }`}
                                onClick={() =>
                                  document
                                    .getElementById("file-upload")
                                    ?.click()
                                }
                              >
                                {value ? (
                                  <>
                                    <div className="text-6xl mb-4">✅</div>
                                    <p className="text-primary font-medium mb-2">
                                      Arquivo selecionado:
                                    </p>
                                    <p className="text-sm text-foreground mb-2">
                                      {value.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {(value.size / 1024).toFixed(2)} KB
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                      Clique para selecionar outro arquivo
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <div className="text-6xl mb-4">📁</div>
                                    <p className="text-foreground mb-2">
                                      Arraste e solte seu arquivo aqui ou clique
                                      para selecionar
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Formatos suportados: .txt, .pdf
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
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
              </div>
            </div>
          </div>
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
                        result.classification.is_productive
                          ? "text-primary"
                          : "text-muted-foreground"
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

      <AlertDialog
        open={showFileDisabledModal}
        onOpenChange={setShowFileDisabledModal}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Envio de Arquivos Desativado</AlertDialogTitle>
            <AlertDialogDescription>
              No momento, o envio de arquivos não está disponível. Por favor,
              use o modo de texto para análise de emails.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowFileDisabledModal(false)}>
              Ok
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
