"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const roles_module_1 = require("./roles/roles.module");
const permissions_module_1 = require("./permissions/permissions.module");
const students_module_1 = require("./students/students.module");
const parents_module_1 = require("./parents/parents.module");
const teachers_module_1 = require("./teachers/teachers.module");
const classes_module_1 = require("./classes/classes.module");
const subjects_module_1 = require("./subjects/subjects.module");
const attendance_module_1 = require("./attendance/attendance.module");
const grades_module_1 = require("./grades/grades.module");
const lessons_module_1 = require("./lessons/lessons.module");
const finance_module_1 = require("./finance/finance.module");
const payments_module_1 = require("./payments/payments.module");
const billing_module_1 = require("./billing/billing.module");
const library_module_1 = require("./library/library.module");
const health_module_1 = require("./health/health.module");
const notifications_module_1 = require("./notifications/notifications.module");
const events_module_1 = require("./events/events.module");
const communication_module_1 = require("./communication/communication.module");
const uploads_module_1 = require("./uploads/uploads.module");
const storage_module_1 = require("./storage/storage.module");
const reports_module_1 = require("./reports/reports.module");
const audit_module_1 = require("./audit/audit.module");
const settings_module_1 = require("./settings/settings.module");
const integrations_module_1 = require("./integrations/integrations.module");
const gestao_module_1 = require("./gestao/gestao.module");
const site_config_module_1 = require("./site-config/site-config.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            students_module_1.StudentsModule,
            parents_module_1.ParentsModule,
            teachers_module_1.TeachersModule,
            classes_module_1.ClassesModule,
            subjects_module_1.SubjectsModule,
            attendance_module_1.AttendanceModule,
            grades_module_1.GradesModule,
            lessons_module_1.LessonsModule,
            finance_module_1.FinanceModule,
            payments_module_1.PaymentsModule,
            billing_module_1.BillingModule,
            library_module_1.LibraryModule,
            health_module_1.HealthModule,
            notifications_module_1.NotificationsModule,
            events_module_1.EventsModule,
            communication_module_1.CommunicationModule,
            uploads_module_1.UploadsModule,
            storage_module_1.StorageModule,
            reports_module_1.ReportsModule,
            audit_module_1.AuditModule,
            settings_module_1.SettingsModule,
            integrations_module_1.IntegrationsModule,
            gestao_module_1.GestaoModule,
            site_config_module_1.SiteConfigModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map