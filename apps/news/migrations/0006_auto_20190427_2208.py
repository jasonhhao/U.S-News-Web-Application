# Generated by Django 2.0.2 on 2019-04-27 22:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0005_auto_20190427_2206'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='banner',
            options={'ordering': ['-priority']},
        ),
        migrations.RenameField(
            model_name='banner',
            old_name='position',
            new_name='priority',
        ),
    ]
