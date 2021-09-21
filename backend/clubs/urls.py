from django.urls import path
from . import views
urlpatterns = [
    path('<int:user>/profiles/<int:profile>/clubs', views.ClubView.as_view(), name='profile_view'),
    path('<int:user>/profiles/<int:profile>/clubs/<str:uri>', views.ClubDateView.as_view(), name='profile_view'),
]