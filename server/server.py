from flask import Flask, request
from flask_restful import Api, Resource
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)
api = Api(app)


class UpdateData(Resource):
    def get(self, eid):
        try:
            conn = psycopg2.connect(database='empdet', user='postgres',
                                    password='postgresRoot', host='localhost', port='5432')
            curr = conn.cursor()
            curr.execute(
                "SELECT * FROM employeeDetails WHERE eid = %s", (eid,))
            row = curr.fetchone()

            if row:
                return {'eid': row[0], 'fname': row[1], 'lname': row[2], 'dept': row[3],
                        'desig': row[4], 'salary': row[5], 'dob': str(row[6])}

        except (Exception, psycopg2.Error) as error:
            print("Error with the database:", error)
        finally:
            if conn:
                curr.close()
                conn.close()

    def delete(self, eid):
        try:
            conn = psycopg2.connect(database='empdet', user='postgres',
                                    password='postgresRoot', host='localhost', port='5432')
            curr = conn.cursor()
            curr.execute(
                "DELETE FROM employeeDetails WHERE eid = %s", (eid,))
            conn.commit()
            curr.execute("SELECT * FROM employeeDetails")
            result = curr.fetchall()
            data = []
            if result:
                for row in result:
                    data.append({'eid': row[0], 'fname': row[1], 'lname': row[2], 'dept': row[3],
                                'desig': row[4], 'salary': row[5], 'dob': str(row[6])})
                return {'data': data}
        except (Exception, psycopg2.Error) as error:
            print("Error with the database:", error)
        finally:
            if conn:
                curr.close()
                conn.close()


class PostData(Resource):
    def post(self):
        args = request.json
        try:
            conn = psycopg2.connect(database='empdet', user='postgres',
                                    password='postgresRoot', host='localhost', port='5432')
            curr = conn.cursor()
            curr.execute("INSERT INTO employeeDetails(eid, fname, lname, dept, desig, salary, dob) VALUES(%s, %s, %s, %s, %s, %s, %s)",
                         (int(args['eid']), args['fname'], args['lname'], args['dept'], args['desig'], int(args['salary']), args['dob']))

            if curr.rowcount != 0:
                conn.commit()
                curr.execute("SELECT * FROM employeeDetails")
                result = curr.fetchall()
                data = []
                if result:
                    for row in result:
                        data.append({'eid': row[0], 'fname': row[1], 'lname': row[2], 'dept': row[3],
                                    'desig': row[4], 'salary': row[5], 'dob': str(row[6])})
                    return {'data': data}
            else:
                return {'status': False}

        except (Exception, psycopg2.Error) as error:
            print("Error with the database:", error)
        # finally:
        #     if conn:
        #         curr.close()
        #         conn.close()

    def put(self):
        args = request.json
        try:
            conn = psycopg2.connect(database='empdet', user='postgres',
                                    password='postgresRoot', host='localhost', port='5432')
            curr = conn.cursor()
            curr.execute("""UPDATE employeeDetails 
                         SET 
                         eid = %s, 
                         fname = %s, 
                         lname = %s, 
                         dept = %s, 
                         desig = %s, 
                         salary = %s, 
                         dob = %s 
                         WHERE
                         eid = %s
                         """,
                         (int(args['eid']), args['fname'], args['lname'], args['dept'], args['desig'], int(args['salary']), args['dob'], args['eid']))

            conn.commit()
            curr.execute("SELECT * FROM employeeDetails")
            result = curr.fetchall()
            data = []
            if result:
                for row in result:
                    data.append({'eid': row[0], 'fname': row[1], 'lname': row[2], 'dept': row[3],
                                'desig': row[4], 'salary': row[5], 'dob': str(row[6])})
                return {'data': data}

        except (Exception, psycopg2.Error) as error:
            print("Error with the database:", error)
        finally:
            if conn:
                curr.close()
                conn.close()


api.add_resource(PostData, '/postData')
api.add_resource(UpdateData, '/updData/<int:eid>')

if __name__ == "__main__":
    app.run(debug=True)
