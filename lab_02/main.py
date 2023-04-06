from tkinter import *
from tkinter import messagebox as mb, messagebox

from math import *

main_root = Tk(className="Lab_02")
frm_param = Frame(main_root)
#Меню
mainmenu = Menu(main_root)
main_root.config(menu=mainmenu)
submenu = Menu(mainmenu)
# Параметры для рисования
canvas_screen = [1280, 960] # Холст
user_center = [canvas_screen[0] // 2, canvas_screen[1] // 2] # Введенный центр
fig_center = [canvas_screen[0] // 2, canvas_screen[1] // 2]  # Центр
ent_width = 10  # ширинна полей ввода
fig_width = 4  # ширина основной раскраски
fill_width = 12 # заливка

# Координаты тела

def oval_generate_heart(a, b, shift_x, shift_y):
    temp = []
    t = 226

    while (t <= 314):
        x = a * cos((t * pi) / 180)
        y = b * sin((t * pi) / 180)
        temp.append([fig_center[0] + (x - shift_x), (fig_center[1] + (y - shift_y))])
        t += 0.1

    return temp

def oval_generate_eye_1_1(a, b, shift_x, shift_y):
    temp = []
    t = 163

    while (t <= 210):
        x = a * cos((t * pi) / 180)
        y = b * sin((t * pi) / 180)
        temp.append([fig_center[0] + (x - shift_x), (fig_center[1] + (y - shift_y))])
        t += 0.1

    return temp

def oval_generate_eye_2_1(a, b, shift_x, shift_y):
    temp = []
    t = 330

    while (t <= 377):
        x = a * cos((t * pi) / 180)
        y = b * sin((t * pi) / 180)
        temp.append([fig_center[0] + (x - shift_x), (fig_center[1] + (y - shift_y))])
        t += 0.1

    return temp

def oval_generate_eye_1_2(a, b, shift_x, shift_y):
    temp = []
    t = 364

    while (t <= 392):
        x = a * cos((t * pi) / 180)
        y = b * sin((t * pi) / 180)
        temp.append([fig_center[0] + (x - shift_x), (fig_center[1] + (y - shift_y))])
        t += 0.1

    return temp

def oval_generate_eye_2_2(a, b, shift_x, shift_y):
    temp = []
    t = 148

    while (t <= 176):
        x = a * cos((t * pi) / 180)
        y = b * sin((t * pi) / 180)
        temp.append([fig_center[0] + (x - shift_x), (fig_center[1] + (y - shift_y))])
        t += 0.1

    return temp

heart_1 = oval_generate_heart(19, 19, -12.5, -17)
heart_2 = oval_generate_heart(19, 19, 12.5, -17)

eye_1_1=oval_generate_eye_1_1(30, 30, 66, 80)
eye_2_1=oval_generate_eye_2_1(30, 30, -66, 80)

eye_1_2=oval_generate_eye_1_2(30, 30, 81, 80)
eye_2_2=oval_generate_eye_2_2(30, 30, -81, 80)

left_extra_lines=[
        [fig_center[0] - 40, fig_center[1] - 86],
        [fig_center[0], fig_center[1] - 238],
        [fig_center[0] - 74, fig_center[1] - 238],
        [fig_center[0] - 94, fig_center[1] - 187],
        [fig_center[0] - 74, fig_center[1] - 238],
        [fig_center[0] - 171, fig_center[1] - 291],
        [fig_center[0] - 112, fig_center[1] - 173],
        [fig_center[0] - 94, fig_center[1] - 187],
        [fig_center[0] - 40, fig_center[1] - 86],
        [fig_center[0] - 41, fig_center[1] - 74],
        [fig_center[0] - 43, fig_center[1] - 64],
        [fig_center[0] - 25, fig_center[1] + 6],
        [fig_center[0] - 80, fig_center[1] + 17],
        [fig_center[0] - 76, fig_center[1] + 44],
        [fig_center[0] - 80, fig_center[1] + 17],
        [fig_center[0] - 136, fig_center[1] - 41],
        [fig_center[0] - 126, fig_center[1] + 12],
        [fig_center[0] - 136, fig_center[1] - 41],
        [fig_center[0] - 153, fig_center[1] - 101]
        ]

left_side_head = [
        [fig_center[0] - 121, fig_center[1] - 83],
        [fig_center[0] - 92, fig_center[1] - 95],
        [fig_center[0] - 146, fig_center[1] - 143],
        [fig_center[0] - 151, fig_center[1] - 119],
        [fig_center[0] - 153, fig_center[1] - 101],
        [fig_center[0] - 121, fig_center[1] - 83],
        [fig_center[0] - 99, fig_center[1] - 73],
        [fig_center[0] - 78, fig_center[1] - 64],
        [fig_center[0] - 50, fig_center[1] - 64],
        [fig_center[0] - 43, fig_center[1] - 64],
        [fig_center[0] - 41, fig_center[1] - 74],
        [fig_center[0] - 51, fig_center[1] - 78],
        [fig_center[0] - 63, fig_center[1] - 90],
        [fig_center[0] - 92, fig_center[1] - 95],
        [fig_center[0] - 146, fig_center[1] - 143],
        [fig_center[0] - 112, fig_center[1] - 173],
        [fig_center[0] - 171, fig_center[1] - 291],
        [fig_center[0] - 178, fig_center[1] - 270],
        [fig_center[0] - 169, fig_center[1] - 164],
        [fig_center[0] - 151, fig_center[1] - 119],
        [fig_center[0] - 153, fig_center[1] - 101],
        [fig_center[0] - 162, fig_center[1] - 45],
        [fig_center[0] - 126, fig_center[1] + 12],
        [fig_center[0] - 76, fig_center[1] + 44],
        [fig_center[0] - 38, fig_center[1] + 66],
        [fig_center[0], fig_center[1] + 28]
        ]

right_side_head = [
        [fig_center[0] + 121, fig_center[1] - 83],
        [fig_center[0] + 92, fig_center[1] - 95],
        [fig_center[0] + 146, fig_center[1] - 143],
        [fig_center[0] + 151, fig_center[1] - 119],
        [fig_center[0] + 153, fig_center[1] - 101],
        [fig_center[0] + 121, fig_center[1] - 83],
        [fig_center[0] + 99, fig_center[1] - 73],
        [fig_center[0] + 78, fig_center[1] - 64],
        [fig_center[0] + 50, fig_center[1] - 64],
        [fig_center[0] + 43, fig_center[1] - 64],
        [fig_center[0] + 41, fig_center[1] - 74],
        [fig_center[0] + 51, fig_center[1] - 78],
        [fig_center[0] + 63, fig_center[1] - 90],
        [fig_center[0] + 92, fig_center[1] - 95],
        [fig_center[0] + 146, fig_center[1] - 143],
        [fig_center[0] + 112, fig_center[1] - 173],
        [fig_center[0] + 171, fig_center[1] - 291],
        [fig_center[0] + 178, fig_center[1] - 270],
        [fig_center[0] + 169, fig_center[1] - 164],
        [fig_center[0] + 151, fig_center[1] - 119],
        [fig_center[0] + 153, fig_center[1] - 101],
        [fig_center[0] + 162, fig_center[1] - 45],
        [fig_center[0] + 126, fig_center[1] + 12],
        [fig_center[0] + 76, fig_center[1] + 44],
        [fig_center[0] + 38, fig_center[1] + 66],
        [fig_center[0], fig_center[1] + 28]
        ]

right_extra_lines=[
        [fig_center[0] + 40, fig_center[1] - 86],
        [fig_center[0], fig_center[1] - 238],
        [fig_center[0] + 74, fig_center[1] - 238],
        [fig_center[0] + 94, fig_center[1] - 187],
        [fig_center[0] + 74, fig_center[1] - 238],
        [fig_center[0] + 171, fig_center[1] - 291],
        [fig_center[0] + 112, fig_center[1] - 173],
        [fig_center[0] + 94, fig_center[1] - 187],
        [fig_center[0] + 40, fig_center[1] - 86],
        [fig_center[0] + 41, fig_center[1] - 74],
        [fig_center[0] + 43, fig_center[1] - 64],
        [fig_center[0] + 25, fig_center[1] + 6],
        [fig_center[0] + 80, fig_center[1] + 17],
        [fig_center[0] + 76, fig_center[1] + 44],
        [fig_center[0] + 80, fig_center[1] + 17],
        [fig_center[0] + 136, fig_center[1] - 41],
        [fig_center[0] + 126, fig_center[1] + 12],
        [fig_center[0] + 136, fig_center[1] - 41],
        [fig_center[0] + 153, fig_center[1] - 101]
        ]

nose_lines = [
        [fig_center[0] + 25, fig_center[1] + 6],
        [fig_center[0] , fig_center[1] + 28],
        [fig_center[0] + 38, fig_center[1] + 66],
        [fig_center[0] , fig_center[1] + 82],
        [fig_center[0] - 38, fig_center[1] + 66],
        [fig_center[0] , fig_center[1] + 28],
        [fig_center[0] - 25, fig_center[1] + 6]
        ]
fill_fig = [
            [fig_center[0] + 25, fig_center[1] + 6],
            [fig_center[0] + 25.9, fig_center[1] + 3.3],
            [fig_center[0] + 20, fig_center[1] - 0.2],
            [fig_center[0] + 12.5, fig_center[1] - 2],
            [fig_center[0] + 7, fig_center[1] - 1.2],
            [fig_center[0] , fig_center[1] + 2.75],
            [fig_center[0] - 7, fig_center[1] - 1.2],
            [fig_center[0] - 12.5, fig_center[1] - 2],
            [fig_center[0] - 20, fig_center[1] - 0.2],
            [fig_center[0] - 25.9, fig_center[1] + 3.3],
            [fig_center[0] - 25, fig_center[1] + 6],
            [fig_center[0] , fig_center[1] + 28],
            [fig_center[0] + 25, fig_center[1] + 6]
           ]

fig_coords = [left_side_head, right_side_head, left_extra_lines, right_extra_lines, nose_lines, heart_1, heart_2, eye_1_1, eye_2_1, eye_1_2, eye_2_2, fill_fig]
undo = [[]] * len(fig_coords)

reset = list()

for i in range(len(fig_coords)):
    reset.append([])
    for j in range(len(fig_coords[i])):
        reset[i].append([])
        reset[i][j].append(fig_coords[i][j][0])
        reset[i][j].append(fig_coords[i][j][1])

reset_center = [0] * 2
undo_center = []
reset_center = [canvas_screen[0] // 2, canvas_screen[1] // 2]

def menuinfo(case):
    if case == 1:
        messagebox.showinfo(title='Об авторе', message='Программу выполнил: \n'
                            'Земцов Артемий Иу7-44Б \n'
                            '2023г. \n')
    if case == 2:
        messagebox.showinfo(title='О программе', message='Программа предназначена для выполнения действий с заранее нарисованной фигурой:\n\n'
                            '1) Паралельного переноса.\n'
                            '2) Масштабирования относительно точки.\n'
                            '3) Поворота на угол (в градусах) относительно точки.\n \n \n'
                            'Все значенния вводяться в вещественнном формате.\n \n \n'
                            'Для выполнения действий предоставлены кнопки, перед нажатием, заполните поля ввода пожайлуста.\n \n \n'
                            'Для выбора центра поворота или масштабирования введите центр или воспользуйтесь стандартным.\n')
    if case == 3:
        result = messagebox.askyesno(title="Выход", message="Вы хотите выйти?")
        if result:
            exit()


def undo_caching(): # Кеш для отмены действия
    global undo
    global undo_center

    undo_center.clear()
    undo.clear()

    undo_center.append(user_center[0])
    undo_center.append(user_center[1])

    for i in range(len(fig_coords)):
        undo.append([])
        for j in range(len(fig_coords[i])):
            undo[i].append([])
            undo[i][j].append(fig_coords[i][j][0])
            undo[i][j].append(fig_coords[i][j][1])


def scale_figure(figure, c_x, c_y): # Маcштабированние фигуры
    for i in range(len(figure)):
        tmp_x = figure[i][0]
        tmp_y = figure[i][1]
        figure[i][0] = (tmp_x - user_center[0]) * c_x + user_center[0]
        figure[i][1] = (tmp_y - user_center[1]) * c_y + user_center[1]

    return figure


def move_figure(figure, x, y): # Движение фигуры
    for i in range(len(figure)):
        figure[i][0] += x
        figure[i][1] += y

    return figure


def rotate_figure(figure, angle): # Поворот на угол
    for i in range(len(figure)):
        tmp_x = figure[i][0] - user_center[0]
        tmp_y = figure[i][1] - user_center[1]
        figure[i][0] = tmp_x * cos(angle) - tmp_y * sin(angle) + user_center[0]
        figure[i][1] = tmp_x * sin(angle) + tmp_y * cos(angle) + user_center[1]

    return figure


def scaling(): # Функция кнопки масшатибированния
    global fig_coords
    global fig_center

    undo_caching()

    try:
        coeff_x = float(ent_scale_x.get())
        coeff_y = float(ent_scale_y.get())
    except:
        messagebox.showerror("Error", "Введены некорректные коеф-нты для масштабирования")
        return

    for i in range(len(fig_coords)):
        fig_coords[i] = scale_figure(fig_coords[i], coeff_x, coeff_y)

    cnv_wall.delete(ALL)
    draw_figure()


def moving(): # Функция кнопки движения
    global fig_center

    try:
        step_x = float(ent_step_x.get())
        step_y = -float(ent_step_y.get())
    except:
        messagebox.showerror("Error", "Введены некорректные смещения.")
        return

    undo_caching()

    for i in range(len(fig_coords)):
        fig_coords[i] = move_figure(fig_coords[i], step_x, step_y)

    cnv_wall.delete(ALL)
    draw_figure()


def rotating(side): # Функция кнопки поворота
    global fig_coords
    global fig_center

    undo_caching()

    try:
        angle = ((float(ent_angle.get()) * pi) / 180) * side
    except:
        messagebox.showerror("Error", "Введен некорректный угол поворота")
        return

    for i in range(len(fig_coords)):
        fig_coords[i] = rotate_figure(fig_coords[i], angle)

    cnv_wall.delete(ALL)
    draw_figure()


def rotate_rigth(): # Выбор угла поворота
    side = 1
    rotating(side)


def rotate_left(): # Выбор угла поворота
    side = -1
    rotating(side)


def update_center(): # Функция ввода центра пользователем
    global user_center

    undo_caching()

    try:
        new_x = float(ent_center_x.get())
        new_y = canvas_screen[1] - float(ent_center_y.get())
    except:
        messagebox.showerror("Error", "Введены некорректные координаты для центра")
        return

    user_center[0] = new_x
    user_center[1] = new_y
    cnv_wall.delete(ALL)
    draw_figure()


def go_undo(): #Функция отмены одного действия
    global fig_coords
    global fig_center

    user_center[0] = undo_center[0]
    user_center[1] = undo_center[1]

    for i in range(len(fig_coords)):
        for j in range(len(fig_coords[i])):
            fig_coords[i][j][0] = undo[i][j][0]
            fig_coords[i][j][1] = undo[i][j][1]

    cnv_wall.delete(ALL)
    draw_figure()


def go_reset(): # Фуннкция отмены всего (до заводских настроик)
    global fig_coords
    global fig_center

    user_center[0] = reset_center[0]
    user_center[1] = reset_center[1]

    for i in range(len(fig_coords)):
        for j in range(len(fig_coords[i])):
            fig_coords[i][j][0] = reset[i][j][0]
            fig_coords[i][j][1] = reset[i][j][1]

    cnv_wall.delete(ALL)
    draw_figure()

# Центр
frm_center = LabelFrame(frm_param, text="Центр")

lbl_center_x = Label(frm_center, text="По X: ")
ent_center_x = Entry(frm_center, width=ent_width)
ent_center_x.insert(0, '0')

lbl_center_y = Label(frm_center, text="По Y: ")
ent_center_y = Entry(frm_center, width=ent_width)
ent_center_y.insert(0, '0')

btn_center = Button(frm_center, text="Ввести", command=update_center)

lbl_center_x.grid(row=0, column=0, sticky="WESN", padx=10, pady=10)
ent_center_x.grid(row=0, column=1, sticky="WESN", padx=10, pady=10)
lbl_center_y.grid(row=1, column=0, sticky="WESN", padx=10, pady=10)
ent_center_y.grid(row=1, column=1, sticky="WESN", padx=10, pady=10)
btn_center.grid(row=2, column=0, columnspan=2, sticky="WESN", padx=10, pady=10)

frm_center.grid(row=0, column=0, sticky='WESN', padx=10, pady=10)

# Движение
frm_move = LabelFrame(frm_param, text="Движение")
frm_step = Frame(frm_move)
frm_btn_move = Frame(frm_move)

lbl_step_x = Label(frm_step, text="Шаг по X:")
ent_step_x = Entry(frm_step, width=ent_width)
ent_step_x.insert(0, '0')

lbl_step_y = Label(frm_step, text="Шаг по Y:")
ent_step_y = Entry(frm_step, width=ent_width)
ent_step_y.insert(0, '0')

lbl_step_x.grid(row=0, column=0, sticky="WESN", padx=10, pady=10)
ent_step_x.grid(row=0, column=1, sticky="WESN", padx=10, pady=10)

lbl_step_y.grid(row=1, column=0, sticky="WESN", padx=10, pady=10)
ent_step_y.grid(row=1, column=1, sticky="WESN", padx=10, pady=10)

btn_move = Button(frm_btn_move, text="Передвинуть", command=moving)
btn_move.pack()
frm_step.grid(row=0, column=0, sticky='WESN', padx=10, pady=10)
frm_btn_move.grid(row=1, column=0, sticky='W', padx=10, pady=10)
frm_move.grid(row=1, column=0, sticky='WESN', padx=10, pady=10)

# Масштабирование
frm_scale = LabelFrame(frm_param, text="Масштабирование")

lbl_scale_x = Label(frm_scale, text="По X: ")
ent_scale_x = Entry(frm_scale, width=ent_width)
ent_scale_x.insert(0, '1')

lbl_scale_y = Label(frm_scale, text="По Y: ")
ent_scale_y = Entry(frm_scale, width=ent_width)
ent_scale_y.insert(0, '1')

btn_scale = Button(frm_scale, text="Масштабировать", command=scaling)

lbl_scale_x.grid(row=0, column=0, padx=10, pady=10)
ent_scale_x.grid(row=0, column=1, padx=10, pady=10)
lbl_scale_y.grid(row=1, column=0, padx=10, pady=10)
ent_scale_y.grid(row=1, column=1, padx=10, pady=10)

btn_scale.grid(row=2, column=0, columnspan=2, padx=10, pady=10, sticky='WESN')

frm_scale.grid(row=2, column=0, sticky='WESN', padx=10, pady=10)

# Поворот
frm_rot = LabelFrame(frm_param, text="Поворот")
frm_angle = Frame(frm_rot)
frm_btn_rot = Frame(frm_rot)

lbl_angle = Label(frm_angle, text="Угол: ")
ent_angle = Entry(frm_angle, width=ent_width)
ent_angle.insert(0, '0')

lbl_angle.grid(row=0, column=0, padx=5)
ent_angle.grid(row=0, column=1, padx=5)

btn_rot_left = Button(frm_btn_rot, text="<", command=rotate_left)
btn_rot_rigth = Button(frm_btn_rot, text=">", command=rotate_rigth)

btn_rot_left.grid(row=0, column=0, sticky='WESN', padx=1, pady=5)
btn_rot_rigth.grid(row=0, column=1, sticky='WESN', padx=1, pady=5)

frm_angle.grid(row=0, column=0, sticky='WESN', padx=10, pady=10)
frm_btn_rot.grid(row=1, column=0, padx=10, pady=10)
frm_rot.grid(row=3, column=0, sticky='WESN', padx=10, pady=10)

btn_back = Button(frm_param, text="Вернуть", command=go_undo)
btn_back.grid(row=4, column=0, sticky='WESN', padx=10, pady=5)

btn_reset = Button(frm_param, text="Сбросить все", command=go_reset)
btn_reset.grid(row=5, column=0, sticky='WESN', padx=10, pady=5)

# Рисовка
frm_draw = LabelFrame(main_root, text="Изображение")

cnv_wall = Canvas(frm_draw, width=canvas_screen[0], height=canvas_screen[1], bg="white")

cnv_wall.pack()

frm_draw.grid(row=0, column=1, sticky='WESN')
frm_param.grid(row=0, column=0, sticky='WESN')


def draw_figure(): # Отрисовать котика и центр 
    cnv_wall.create_oval(user_center[0], user_center[1],
                         user_center[0], user_center[1],
                         width=6, outline="red")

    #left_side_head  
    for i in range(len(left_side_head) - 1):
        cnv_wall.create_line(left_side_head[i][0], left_side_head[i][1], left_side_head[i + 1][0], left_side_head[i + 1][1],
                             width=fig_width + 1)
    
    #right_side_head
    for i in range(len(right_side_head) - 1):
        cnv_wall.create_line(right_side_head[i][0], right_side_head[i][1], right_side_head[i + 1][0], right_side_head[i + 1][1],
                             width=fig_width + 1)
    
    #left_extra_lines
    for i in range(len(left_extra_lines) - 1):
        cnv_wall.create_line(left_extra_lines[i][0], left_extra_lines[i][1], left_extra_lines[i + 1][0], left_extra_lines[i + 1][1],
                             width=fig_width + 1)

    #right_extra_lines
    for i in range(len(right_extra_lines) - 1):
        cnv_wall.create_line(right_extra_lines[i][0], right_extra_lines[i][1], right_extra_lines[i + 1][0], right_extra_lines[i + 1][1],
                             width=fig_width + 1)

    #nose_lines
    for i in range(len(nose_lines) - 1):
        cnv_wall.create_line(nose_lines[i][0], nose_lines[i][1], nose_lines[i + 1][0], nose_lines[i + 1][1],
                             width=fig_width + 1)
        
    #heart_1
    for i in range(len(heart_1)):
        cnv_wall.create_oval(heart_1[i][0], heart_1[i][1], heart_1[i][0], heart_1[i][1],
                             width=fig_width, fill='black')


    #heart_2
    for i in range(len(heart_2)):
        cnv_wall.create_oval(heart_2[i][0], heart_2[i][1], heart_2[i][0], heart_2[i][1],
                             width=fig_width, fill='black')
    
    #eye_1_1
    for i in range(len(eye_1_1)):
        cnv_wall.create_oval(eye_1_1[i][0], eye_1_1[i][1], eye_1_1[i][0], eye_1_1[i][1],
                             width=fig_width - 2 ,fill='black')

    #eye_2_1
    for i in range(len(eye_2_1)):
        cnv_wall.create_oval(eye_2_1[i][0], eye_2_1[i][1], eye_2_1[i][0], eye_2_1[i][1],
                             width=fig_width - 2 ,fill='black')
        
    #eye_1_1
    for i in range(len(eye_1_2)):
        cnv_wall.create_oval(eye_1_2[i][0], eye_1_2[i][1], eye_1_2[i][0], eye_1_2[i][1],
                             width=fig_width - 2 ,fill='black')

    #eye_2_1
    for i in range(len(eye_2_2)):
        cnv_wall.create_oval(eye_2_2[i][0], eye_2_2[i][1], eye_2_2[i][0], eye_2_2[i][1],
                             width=fig_width - 2 ,fill='black')
    
    #fill_heart
    for i in range(len(fill_fig) - 1):
        cnv_wall.create_polygon(fill_fig[0][0], fill_fig[0][1], fill_fig[1][0], fill_fig[1][1], fill_fig[2][0], fill_fig[2][1],
                fill_fig[3][0], fill_fig[3][1], fill_fig[4][0], fill_fig[4][1], fill_fig[5][0], fill_fig[5][1],
                fill_fig[6][0], fill_fig[6][1], fill_fig[7][0], fill_fig[7][1], fill_fig[8][0], fill_fig[8][1],
                fill_fig[9][0], fill_fig[9][1], fill_fig[10][0], fill_fig[10][1],
                fill_fig[11][0], fill_fig[11][1], fill_fig[12][0], fill_fig[12][1],
                fill='black', width=fill_width)

def main():
    draw_figure()


main()
mainmenu.add_cascade(label='Меню', menu=submenu)
submenu.add_cascade(label='Об авторе', command= lambda: menuinfo(1))
submenu.add_cascade(label='О программе', command= lambda: menuinfo(2))
submenu.add_cascade(label='Выход', command= lambda : menuinfo(3))
main_root.mainloop()