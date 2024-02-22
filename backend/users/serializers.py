from rest_framework import serializers

from .models import User


class UserSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField()
    firstName = serializers.CharField(max_length=15)
    lastName = serializers.CharField(max_length=15)
    age = serializers.IntegerField()
    gender = serializers.CharField(max_length=6)
    city = serializers.CharField(max_length=20)

    def create(self, validated_data):
        return User.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.firstName = validated_data.get('firstName', instance.firstName)
        instance.lastName = validated_data.get('lastName', instance.lastName)
        instance.age = validated_data.get('age', instance.age)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.city = validated_data.get('city', instance.city)
        instance.save()
        return instance
