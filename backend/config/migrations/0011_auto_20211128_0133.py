# Generated by Django 3.2.9 on 2021-11-28 01:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('config', '0010_auto_20211123_0157'),
    ]

    operations = [
        migrations.AddField(
            model_name='clubs',
            name='end_hour',
            field=models.IntegerField(default=22),
        ),
        migrations.AddField(
            model_name='clubs',
            name='starting_hour',
            field=models.IntegerField(default=9),
        ),
    ]