-- CreateEnum
CREATE TYPE "QuestionTargetType" AS ENUM ('APARTMENT', 'SPACE', 'ELEMENT');

-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('BOOLEAN', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TEXT', 'NUMBER', 'PHOTO');

-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('SAFETY', 'CLEANLINESS', 'MAINTENANCE', 'LEGAL', 'INVENTORY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SeverityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ResponsibleType" AS ENUM ('CLEANING', 'MAINTENANCE', 'MANAGEMENT', 'OWNER', 'OTHER');

-- CreateEnum
CREATE TYPE "ImpactLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "NonConformityType" AS ENUM ('OBSERVATION', 'MINOR', 'MAJOR', 'CRITICAL');

-- CreateTable
CREATE TABLE "apartment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "space_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "space_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "space" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "apartment_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "space_type_id" INTEGER NOT NULL,
    "m2" DOUBLE PRECISION,
    "order" INTEGER,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "element_category" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "element_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "element_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "element_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "element" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "space_id" INTEGER NOT NULL,
    "element_type_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "material" TEXT,
    "color" TEXT,
    "condition" TEXT,
    "notes" JSONB,
    "dimensions" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "element_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_template_version" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "valid_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_to" TIMESTAMP(3),
    "created_by" TEXT,
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_template_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_template" (
    "id" SERIAL NOT NULL,
    "version_id" INTEGER NOT NULL,
    "target_type" "QuestionTargetType" NOT NULL,
    "space_type_id" INTEGER,
    "element_type_id" INTEGER,
    "question_text" TEXT NOT NULL,
    "answer_type" "AnswerType" NOT NULL,
    "category" "QuestionCategory" NOT NULL,
    "weight" DOUBLE PRECISION,
    "impact" "ImpactLevel" NOT NULL DEFAULT 'MEDIUM',
    "sort_order" INTEGER,
    "is_mandatory" BOOLEAN NOT NULL DEFAULT false,
    "visibility_condition" JSONB,
    "tags" TEXT,
    "reference" TEXT,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_option" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sort_order" INTEGER,
    "penalty_weight" DOUBLE PRECISION,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_option_followup" (
    "id" SERIAL NOT NULL,
    "answer_option_id" INTEGER NOT NULL,
    "child_question_id" INTEGER NOT NULL,
    "sort_order" INTEGER,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_option_followup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidence_template" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "category" "QuestionCategory" NOT NULL,
    "severity" "SeverityLevel" NOT NULL,
    "non_conformity" "NonConformityType",
    "responsible" "ResponsibleType" NOT NULL,
    "description" TEXT,
    "actions_json" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incidence_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auto_incidence_rule" (
    "id" SERIAL NOT NULL,
    "answer_option_id" INTEGER NOT NULL,
    "incidence_template_id" INTEGER NOT NULL,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auto_incidence_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_change_log" (
    "id" SERIAL NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "field_name" TEXT NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT,
    "changed_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_change_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "space_type_name_key" ON "space_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "space_type_code_key" ON "space_type"("code");

-- CreateIndex
CREATE UNIQUE INDEX "space_uuid_key" ON "space"("uuid");

-- CreateIndex
CREATE INDEX "idx_space_apartment" ON "space"("apartment_id");

-- CreateIndex
CREATE INDEX "idx_space_spacetype" ON "space"("space_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "element_category_code_key" ON "element_category"("code");

-- CreateIndex
CREATE UNIQUE INDEX "element_category_name_key" ON "element_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "element_type_name_key" ON "element_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "element_type_code_key" ON "element_type"("code");

-- CreateIndex
CREATE INDEX "idx_elementtype_category" ON "element_type"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_element_type_name_category" ON "element_type"("name", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "element_uuid_key" ON "element"("uuid");

-- CreateIndex
CREATE INDEX "idx_element_space" ON "element"("space_id");

-- CreateIndex
CREATE INDEX "idx_element_elementtype" ON "element"("element_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "question_template_version_code_key" ON "question_template_version"("code");

-- CreateIndex
CREATE INDEX "idx_qt_version" ON "question_template"("version_id");

-- CreateIndex
CREATE INDEX "idx_qt_target_space" ON "question_template"("target_type", "space_type_id");

-- CreateIndex
CREATE INDEX "idx_qt_target_element" ON "question_template"("target_type", "element_type_id");

-- CreateIndex
CREATE INDEX "idx_answeroption_question" ON "answer_option"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_answeroption_question_code" ON "answer_option"("question_id", "code");

-- CreateIndex
CREATE INDEX "idx_followup_answeroption" ON "answer_option_followup"("answer_option_id");

-- CreateIndex
CREATE INDEX "idx_followup_childquestion" ON "answer_option_followup"("child_question_id");

-- CreateIndex
CREATE UNIQUE INDEX "incidence_template_code_key" ON "incidence_template"("code");

-- CreateIndex
CREATE UNIQUE INDEX "auto_incidence_rule_answer_option_id_key" ON "auto_incidence_rule"("answer_option_id");

-- CreateIndex
CREATE INDEX "idx_rule_incidence_template" ON "auto_incidence_rule"("incidence_template_id");

-- CreateIndex
CREATE INDEX "idx_tcl_entity_entityid" ON "template_change_log"("entity", "entity_id");

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_apartment_id_fkey" FOREIGN KEY ("apartment_id") REFERENCES "apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_space_type_id_fkey" FOREIGN KEY ("space_type_id") REFERENCES "space_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "element_type" ADD CONSTRAINT "element_type_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "element_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "element" ADD CONSTRAINT "element_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "element" ADD CONSTRAINT "element_element_type_id_fkey" FOREIGN KEY ("element_type_id") REFERENCES "element_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_template" ADD CONSTRAINT "question_template_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "question_template_version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_template" ADD CONSTRAINT "question_template_space_type_id_fkey" FOREIGN KEY ("space_type_id") REFERENCES "space_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_template" ADD CONSTRAINT "question_template_element_type_id_fkey" FOREIGN KEY ("element_type_id") REFERENCES "element_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_option" ADD CONSTRAINT "answer_option_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_option_followup" ADD CONSTRAINT "answer_option_followup_answer_option_id_fkey" FOREIGN KEY ("answer_option_id") REFERENCES "answer_option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_option_followup" ADD CONSTRAINT "answer_option_followup_child_question_id_fkey" FOREIGN KEY ("child_question_id") REFERENCES "question_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auto_incidence_rule" ADD CONSTRAINT "auto_incidence_rule_answer_option_id_fkey" FOREIGN KEY ("answer_option_id") REFERENCES "answer_option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auto_incidence_rule" ADD CONSTRAINT "auto_incidence_rule_incidence_template_id_fkey" FOREIGN KEY ("incidence_template_id") REFERENCES "incidence_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
