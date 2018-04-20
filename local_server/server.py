"""
Created by Boa-Lin Lai, originally from Georgia Tech 2017 
ECE 4813 Cloud Computing Lab 7

"""

#!flask/bin/python
from __future__ import print_function
from flask import Flask, jsonify, abort, request, make_response, url_for
from flask import render_template, redirect
from texttable import Texttable
import MySQLdb
import requests
import sqlite3
import json

import sys
    
app = Flask(__name__, static_url_path="")


'''helper function'''

URL = 'https://5w5980sok2.execute-api.us-east-2.amazonaws.com/prod'

def _add_quote(input_str):
    return '\'' + input_str + '\'' 


@app.route('/view-students-by-semester', methods=['GET'])
def view_students_by_semester():   
    return render_template('view_students_by_semester.html', student_by_semesters= \
        requests.get(URL + '/view-students-by-semester').json())

@app.route('/student/update/<int:student_id>', methods=['GET', 'POST'])
def student_update_page(student_id):
    ''''update the student page'''
    if request.method == 'POST':    
        result = request.form
        json_body = {
            "LastName": request.form['LastName'],\
            "Major": request.form['Major'],\
            "Name": request.form['Name'],\
            "GPA": request.form['GPA'],\
        }
        requests.put(URL + '/student-update/' + str(student_id), json=json_body)
        return redirect('/')
    else:
        # get command
        return render_template('student_update.html', \
            student=requests.get(URL + '/student-update/' + str(student_id)).json())


@app.route('/student/detail/<int:student_id>', methods=['GET'])
def view_student_detail(student_id):
    '''generic function for display student, semester, and year'''
    print('passing student id to rest API')
    return render_template('view_student_detail.html', student=\
        requests.get(URL + '/view-student-detail/' + str(student_id)).json())


@app.route('/student/add', methods=['GET', 'POST'])
def student_add_page():
    if request.method == 'POST':    
        json_body = {
                    "LastName": request.form['LastName'],\
                    "Major": request.form['Major'],\
                    "Name": request.form['Name'],\
                    "GPA": request.form['GPA'],\
                    "sId": request.form['sId']\
                }

        r = requests.post(URL + '/add-student', json=json_body)

        return redirect('/')
    else:
        return render_template('add.html')



'''View course and student'''



@app.route('/view-all-student', methods=['GET'])
def view_student_page():    
    return render_template('view_students.html', \
        students=requests.get(URL + '/view-all-students').json())

@app.route('/view-all-courses', methods=['GET'])
def view_course_page():
    ''' add view course '''
    return render_template('course_index.html', \
        courses = requests.get(URL + '/view-all-courses').json())
'''course part'''


@app.route('/course/add', methods=['GET', 'POST'])
def course_add_page():
    if request.method == 'POST':   
        result = request.form
        json_body = {
                    "cId": request.form['cId'],\
                    "cName": request.form['cName']\
                }
        requests.post(URL + '/add-course', json=json_body)
        return redirect('/')
    else:
        return render_template('course_add.html')

'''register part'''


@app.route('/register', methods=['GET', 'POST'])
def register_page():
    if request.method == 'POST':   
        result = request.form
        json_body = {
                    "year": request.form['year'],\
                    "semester": request.form['semester'],\
                    "cId": request.form['cId'],\
                    "sId": request.form['sId']\
                }
        requests.post(URL + '/register', json=json_body)
        return redirect('/')
    else:
        return render_template('register.html', \
                                student_id=requests.get(URL + '/register').json()['student_id'],\
                                course_id=requests.get(URL + '/register').json()['course_id'])


@app.route('/course/delete/<int:course_id>', methods=['GET'])
def delete_course_process(course_id):
    print("delate course")
    requests.delete(URL + "/delete-course/" + str(course_id)).json()
    return redirect('/')


@app.route('/', methods=['GET'])
def home_page():
    return render_template('index.html')


@app.route('/student/delete/<int:student_id>', methods=['GET'])
def delete_student_process(student_id):
    '''delete student process'''
    requests.delete(URL + "/delete-student/" + str(student_id)).json()
    return redirect('/')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=80,debug=True)
    
