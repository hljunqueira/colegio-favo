import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { StudentsModule } from './students/students.module';
import { ParentsModule } from './parents/parents.module';
import { TeachersModule } from './teachers/teachers.module';
import { ClassesModule } from './classes/classes.module';
import { SubjectsModule } from './subjects/subjects.module';
import { AttendanceModule } from './attendance/attendance.module';
import { GradesModule } from './grades/grades.module';
import { LessonsModule } from './lessons/lessons.module';
import { FinanceModule } from './finance/finance.module';
import { PaymentsModule } from './payments/payments.module';
import { BillingModule } from './billing/billing.module';
import { LibraryModule } from './library/library.module';
import { HealthModule } from './health/health.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EventsModule } from './events/events.module';
import { CommunicationModule } from './communication/communication.module';
import { UploadsModule } from './uploads/uploads.module';
import { StorageModule } from './storage/storage.module';
import { ReportsModule } from './reports/reports.module';
import { AuditModule } from './audit/audit.module';
import { SettingsModule } from './settings/settings.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { GestaoModule } from './gestao/gestao.module';
import { SiteConfigModule } from './site-config/site-config.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    StudentsModule,
    ParentsModule,
    TeachersModule,
    ClassesModule,
    SubjectsModule,
    AttendanceModule,
    GradesModule,
    LessonsModule,
    FinanceModule,
    PaymentsModule,
    BillingModule,
    LibraryModule,
    HealthModule,
    NotificationsModule,
    EventsModule,
    CommunicationModule,
    UploadsModule,
    StorageModule,
    ReportsModule,
    AuditModule,
    SettingsModule,
    IntegrationsModule,
    GestaoModule,
    SiteConfigModule,
  ],
})
export class AppModule {}

