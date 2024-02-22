from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from users import views

# Creating Default Router Object
router = DefaultRouter()
# Register StudentViewSet with Router
router.register('users', views.UserModelViewSet, basename='user')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls))
]
