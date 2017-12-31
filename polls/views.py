# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import get_object_or_404, render

# Create your views here.
# from django.http import HttpResponse
# from django.template import loader
# Model list.
from .models import Choice, Question

from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.urls import reverse
from django.views import generic
from django.utils import timezone
from django.core import serializers

# class IndexView(generic.ListView):
#     template_name = 'polls/index.html'
#     context_object_name = 'latest_question_list'

#     def get_queryset(self):
#         """Return the last five published questions."""
#         return Question.objects.filter(
#         	pub_date__lte=timezone.now()
#         ).order_by('-pub_date')[:5]


class DetailView(generic.DetailView):
    model = Question
    template_name = 'polls/detail.html'


class ResultsView(generic.DetailView):
    model = Question
    template_name = 'polls/results.html'


def index(request):
	latest_question_list = Question.objects.order_by('-pub_date')[:5]
	# template = loader.get_template('polls/index.html')
	# context={
	# 	'latest_question_list': latest_question_list,
	# }

	posts_serialized = serializers.serialize('json', latest_question_list)
	return JsonResponse(posts_serialized, safe=False)

	# return render(request, 'polls/index.html', context)

# def detail(request, question_id):
# 	# try:
# 	# 	question = Question.objects.get(pk=question_id)
# 	# except Question.DoesNotExist:
# 	# 	raise Http404("Question does not exist")
# 	question = get_object_or_404(Question, pk=question_id)
# 	# return HttpResponse("You're looking at question %s." %question_id)
# 	return render(request, 'polls/detail.html', {'question':question})

# def results(request, question_id):
#     question = get_object_or_404(Question, pk=question_id)
#     return render(request, 'polls/results.html', {'question': question})

def vote(request, question_id):
	question = get_object_or_404(Question, pk=question_id)
	try:
		selected_choice = question.choice_set.get(pk=request.POST['choice'])
	except (KeyError, Choice.DoesNotExist):
		return render(request, 'polls/detail.html', {
			'question' : question,
			'error_message' : "You didn't select a choice.",
		})
	else:
		selected_choice.votes += 1
		selected_choice.save()
		return HttpResponseRedirect(reverse('polls:results', args=(question.id,)))




























