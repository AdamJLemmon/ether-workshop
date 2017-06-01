import json
import requests

from django.http import HttpResponseRedirect, HttpResponse
from django.views.generic import TemplateView

from workshop_demo.constants import *

class DemoView(TemplateView):
    """
    Base view...
    """
    template_name = "base.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

def deposit(request):
    """
    Deposit an amount from this account into the demo contract
    """
    amount = request.POST.get('amount', None)
    account = request.POST.get('account', None)

    # Request to ether json rpc server
    response = send_json_rpc_request(
        method=DEPOSIT,
        params={
            ACCOUNT: account,
            AMOUNT: amount
        }
    )

    if 'error' in response:
        return HttpResponseRedirect('error')

    return HttpResponseRedirect('success')

def set_state(request):
    """
    Set the state of the demo contract
    """
    state = request.POST.get('state', None)

    # Request to ether json rpc server
    response = send_json_rpc_request(
        method=SET_STATE,
        params={
            STATE: state
        },
    )

    if 'error' in response:
        return HttpResponseRedirect('error')

    return HttpResponseRedirect('success')

def withdraw(request):
    """
    Withdraw the account's entire balance
    """
    account = request.POST.get('account', None)

    # Request to ether json rpc server
    response = send_json_rpc_request(
        method=WITHDRAW,
        params={ ACCOUNT: account },
    )

    if 'error' in response:
        return HttpResponseRedirect('error')

    return HttpResponseRedirect('success')

def error(request):
    """
    TODO incorporate error catching into base
    """
    return HttpResponse('Error')


def send_json_rpc_request(method, params):
    """
    Build and send a json rpc request
    """
    url = RPC_IP + RPC_PORT + '/' + JSON_RPC  # "http://localhost:7777/jsonrpc"
    headers = {CONTENT_TYPE: APP_JSON}

    payload = {
        METHOD: method,
        PARAMS: params,
        JSON_RPC: RPC_VERSION,
        ID: 0,
    }

    response = requests.post(
        url, data=json.dumps(payload), headers=headers
    ).json()

    return response
