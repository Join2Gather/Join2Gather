# Generated by Django 3.2.6 on 2021-08-30 04:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Clubs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('uri', models.CharField(max_length=100)),
            ],
            options={
                'verbose_name': '내 일정과 모임 간의 관계 테이블',
                'db_table': 'clubs',
            },
        ),
        migrations.CreateModel(
            name='Dates',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day', models.CharField(max_length=100)),
                ('hour', models.CharField(max_length=100)),
                ('minute', models.CharField(max_length=100)),
            ],
            options={
                'verbose_name': '일자 테이블',
                'db_table': 'dates',
            },
        ),
        migrations.CreateModel(
            name='Profiles',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': '내 일정 테이블',
                'db_table': 'profiles',
            },
        ),
        migrations.CreateModel(
            name='ProfileDates',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_temporary_reserved', models.BooleanField()),
                ('club_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='config.clubs')),
                ('date_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='config.dates')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': '내 일정과 모임 간의 관계 테이블',
                'db_table': 'profile_dates',
            },
        ),
        migrations.CreateModel(
            name='ClubEntries',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': '내 일정과 모임 간의 관계 테이블',
                'db_table': 'club_entries',
            },
        ),
    ]