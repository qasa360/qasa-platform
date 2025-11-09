-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "IncidenceStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AuditPhotoContext" AS ENUM ('AUDIT', 'SPACE', 'ELEMENT', 'QUESTION', 'RESPONSE', 'INCIDENCE');

-- CreateTable
CREATE TABLE "audit" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "apartment_id" INTEGER NOT NULL,
    "audit_template_version_id" INTEGER NOT NULL,
    "status" "AuditStatus" NOT NULL DEFAULT 'DRAFT',
    "completion_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "cancelled_reason" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_status_history" (
    "id" SERIAL NOT NULL,
    "audit_id" INTEGER NOT NULL,
    "from_status" "AuditStatus",
    "to_status" "AuditStatus" NOT NULL,
    "changed_by" TEXT NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,

    CONSTRAINT "audit_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_item" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "audit_id" INTEGER NOT NULL,
    "question_template_id" INTEGER NOT NULL,
    "target_type" "QuestionTargetType" NOT NULL,
    "apartment_id" INTEGER,
    "space_id" INTEGER,
    "element_id" INTEGER,
    "question_text" TEXT NOT NULL,
    "answer_type" "AnswerType" NOT NULL,
    "category" "QuestionCategory" NOT NULL,
    "weight" DOUBLE PRECISION,
    "impact" "ImpactLevel" NOT NULL,
    "is_mandatory" BOOLEAN NOT NULL,
    "sort_order" INTEGER,
    "is_answered" BOOLEAN NOT NULL DEFAULT false,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "completion_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "parent_audit_item_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_answer_option" (
    "id" SERIAL NOT NULL,
    "audit_item_id" INTEGER NOT NULL,
    "answer_option_template_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sort_order" INTEGER,
    "penalty_weight" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_answer_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_response" (
    "id" SERIAL NOT NULL,
    "audit_item_id" INTEGER NOT NULL,
    "boolean_value" BOOLEAN,
    "text_value" TEXT,
    "number_value" DOUBLE PRECISION,
    "notes" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_response_option" (
    "id" SERIAL NOT NULL,
    "audit_response_id" INTEGER NOT NULL,
    "audit_answer_option_id" INTEGER NOT NULL,

    CONSTRAINT "audit_response_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_incidence" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "audit_id" INTEGER NOT NULL,
    "audit_item_id" INTEGER,
    "incidence_template_id" INTEGER,
    "target_type" "QuestionTargetType" NOT NULL,
    "apartment_id" INTEGER,
    "space_id" INTEGER,
    "element_id" INTEGER,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "category" "QuestionCategory" NOT NULL,
    "severity" "SeverityLevel" NOT NULL,
    "non_conformity" "NonConformityType",
    "responsible" "ResponsibleType" NOT NULL,
    "description" TEXT,
    "actions_json" JSONB,
    "status" "IncidenceStatus" NOT NULL DEFAULT 'OPEN',
    "resolved_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "resolved_by" TEXT,
    "closed_by" TEXT,
    "notes" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_incidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_photo" (
    "id" SERIAL NOT NULL,
    "audit_id" INTEGER NOT NULL,
    "context" "AuditPhotoContext" NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "space_id" INTEGER,
    "element_id" INTEGER,
    "audit_item_id" INTEGER,
    "audit_response_id" INTEGER,
    "audit_incidence_id" INTEGER,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "audit_uuid_key" ON "audit"("uuid");

-- CreateIndex
CREATE INDEX "idx_audit_apartment" ON "audit"("apartment_id");

-- CreateIndex
CREATE INDEX "idx_audit_status" ON "audit"("status");

-- CreateIndex
CREATE INDEX "idx_audit_completion_rate" ON "audit"("completion_rate");

-- CreateIndex
CREATE INDEX "idx_audit_status_history_audit" ON "audit_status_history"("audit_id");

-- CreateIndex
CREATE UNIQUE INDEX "audit_item_uuid_key" ON "audit_item"("uuid");

-- CreateIndex
CREATE INDEX "idx_audit_item_audit" ON "audit_item"("audit_id");

-- CreateIndex
CREATE INDEX "idx_audit_item_space" ON "audit_item"("space_id");

-- CreateIndex
CREATE INDEX "idx_audit_item_element" ON "audit_item"("element_id");

-- CreateIndex
CREATE INDEX "idx_audit_answer_option_item" ON "audit_answer_option"("audit_item_id");

-- CreateIndex
CREATE INDEX "idx_audit_response_item" ON "audit_response"("audit_item_id");

-- CreateIndex
CREATE INDEX "idx_audit_response_option_response" ON "audit_response_option"("audit_response_id");

-- CreateIndex
CREATE INDEX "idx_audit_response_option_answer_option" ON "audit_response_option"("audit_answer_option_id");

-- CreateIndex
CREATE UNIQUE INDEX "audit_incidence_uuid_key" ON "audit_incidence"("uuid");

-- CreateIndex
CREATE INDEX "idx_audit_incidence_audit" ON "audit_incidence"("audit_id");

-- CreateIndex
CREATE INDEX "idx_audit_incidence_status" ON "audit_incidence"("status");

-- CreateIndex
CREATE INDEX "idx_audit_photo_audit" ON "audit_photo"("audit_id");

-- CreateIndex
CREATE INDEX "idx_audit_photo_context" ON "audit_photo"("context");

-- CreateIndex
CREATE INDEX "idx_audit_photo_space" ON "audit_photo"("space_id");

-- CreateIndex
CREATE INDEX "idx_audit_photo_element" ON "audit_photo"("element_id");

-- AddForeignKey
ALTER TABLE "audit" ADD CONSTRAINT "audit_apartment_id_fkey" FOREIGN KEY ("apartment_id") REFERENCES "apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit" ADD CONSTRAINT "audit_audit_template_version_id_fkey" FOREIGN KEY ("audit_template_version_id") REFERENCES "audit_template_version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_status_history" ADD CONSTRAINT "audit_status_history_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_item" ADD CONSTRAINT "audit_item_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_item" ADD CONSTRAINT "audit_item_question_template_id_fkey" FOREIGN KEY ("question_template_id") REFERENCES "audit_question_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_item" ADD CONSTRAINT "audit_item_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_item" ADD CONSTRAINT "audit_item_element_id_fkey" FOREIGN KEY ("element_id") REFERENCES "element"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_item" ADD CONSTRAINT "audit_item_parent_audit_item_id_fkey" FOREIGN KEY ("parent_audit_item_id") REFERENCES "audit_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_answer_option" ADD CONSTRAINT "audit_answer_option_audit_item_id_fkey" FOREIGN KEY ("audit_item_id") REFERENCES "audit_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_response" ADD CONSTRAINT "audit_response_audit_item_id_fkey" FOREIGN KEY ("audit_item_id") REFERENCES "audit_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_response_option" ADD CONSTRAINT "audit_response_option_audit_response_id_fkey" FOREIGN KEY ("audit_response_id") REFERENCES "audit_response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_response_option" ADD CONSTRAINT "audit_response_option_audit_answer_option_id_fkey" FOREIGN KEY ("audit_answer_option_id") REFERENCES "audit_answer_option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_incidence" ADD CONSTRAINT "audit_incidence_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_incidence" ADD CONSTRAINT "audit_incidence_audit_item_id_fkey" FOREIGN KEY ("audit_item_id") REFERENCES "audit_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_incidence" ADD CONSTRAINT "audit_incidence_incidence_template_id_fkey" FOREIGN KEY ("incidence_template_id") REFERENCES "incidence_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_incidence" ADD CONSTRAINT "audit_incidence_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_incidence" ADD CONSTRAINT "audit_incidence_element_id_fkey" FOREIGN KEY ("element_id") REFERENCES "element"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_photo" ADD CONSTRAINT "audit_photo_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_photo" ADD CONSTRAINT "audit_photo_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_photo" ADD CONSTRAINT "audit_photo_element_id_fkey" FOREIGN KEY ("element_id") REFERENCES "element"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_photo" ADD CONSTRAINT "audit_photo_audit_item_id_fkey" FOREIGN KEY ("audit_item_id") REFERENCES "audit_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_photo" ADD CONSTRAINT "audit_photo_audit_response_id_fkey" FOREIGN KEY ("audit_response_id") REFERENCES "audit_response"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_photo" ADD CONSTRAINT "audit_photo_audit_incidence_id_fkey" FOREIGN KEY ("audit_incidence_id") REFERENCES "audit_incidence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
