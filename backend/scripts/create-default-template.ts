/**
 * Script para crear un template de auditoría por defecto
 * Ejecutar con: npx ts-node scripts/create-default-template.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createDefaultTemplate() {
  try {
    // Verificar si ya existe un template por defecto
    const existingDefault = await prisma.auditTemplateVersion.findFirst({
      where: {
        is_default: true,
        valid_to: null,
      },
    });

    if (existingDefault) {
      console.log(
        "✅ Ya existe un template por defecto:",
        existingDefault.code
      );
      return;
    }

    // Crear template por defecto
    const defaultTemplate = await prisma.auditTemplateVersion.create({
      data: {
        code: "BASE_V1",
        name: "Template Base v1",
        description: "Template de auditoría por defecto",
        version: 1,
        valid_from: new Date(),
        is_default: true,
        created_by: "system",
      },
    });

    console.log("✅ Template por defecto creado:", defaultTemplate.code);
    console.log("   ID:", defaultTemplate.id);
    console.log("   Nombre:", defaultTemplate.name);
  } catch (error) {
    console.error("❌ Error al crear template:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultTemplate();
