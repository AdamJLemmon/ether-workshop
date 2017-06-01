from django.conf.urls import url

from workshop_demo.views import DemoView, deposit, withdraw, error, set_state

urlpatterns = [
    url(r'^$', DemoView.as_view(), name='demo'),
    url(r'^deposit$', deposit, name='deposit'),
    url(r'^error$', error, name='error'),
    url(r'^set_state$', set_state, name='set_state'),
    url(r'^success$', DemoView.as_view(), name='success'),
    url(r'^withdraw$', withdraw, name='withdraw'),
]
