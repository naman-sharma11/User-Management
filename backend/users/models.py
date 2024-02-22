from django.db import models


class User(models.Model):
    firstName = models.CharField(max_length=15)
    lastName = models.CharField(max_length=15)
    age = models.IntegerField()
    gender = models.CharField(max_length=6)
    city = models.CharField(max_length=20)

    def __str__(self):
        return self.firstName
