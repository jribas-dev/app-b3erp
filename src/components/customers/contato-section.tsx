"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import type { ClienteFormValues } from "@/lib/forms/cliente-form.form";

import { SectionTitle } from "./section-title";

interface ContatoSectionProps {
  form: UseFormReturn<ClienteFormValues>;
}

export function ContatoSection({ form }: ContatoSectionProps) {
  const { register, control } = form;

  return (
    <>
      <SectionTitle>Contato</SectionTitle>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@empresa.com.br"
            {...register("email")}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="emailnfe">E-mail NF-e</Label>
          <Input
            id="emailnfe"
            type="email"
            placeholder="Para envio de NF-e"
            {...register("emailnfe")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="emailcob">E-mail Cobrança</Label>
          <Input
            id="emailcob"
            type="email"
            placeholder="Para cobranças"
            {...register("emailcob")}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="site">Site</Label>
          <Input
            id="site"
            maxLength={120}
            placeholder="www.empresa.com.br"
            {...register("site")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <Label htmlFor="fone">Telefone</Label>
          <Controller
            control={control}
            name="fone"
            render={({ field }) => (
              <PhoneInput
                id="fone"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="fone2">Telefone 2</Label>
          <Controller
            control={control}
            name="fone2"
            render={({ field }) => (
              <PhoneInput
                id="fone2"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="cel">Celular / WhatsApp</Label>
          <Controller
            control={control}
            name="cel"
            render={({ field }) => (
              <PhoneInput
                id="cel"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </>
  );
}
