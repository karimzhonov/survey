from multiprocessing import cpu_count

bind = '0.0.0.0:8001'
timeouts = 60
max_requests = 1000
workers = cpu_count()

reload = True
name = 'survey_web'
