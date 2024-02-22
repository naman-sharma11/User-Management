import time

from rest_framework import viewsets
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer


class UserModelViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def list(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        # time.sleep(5)
        return Response(serializer.data)
