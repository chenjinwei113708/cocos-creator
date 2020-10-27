# encoding=utf-8
import base64
# 文件转换为base64 2019/11/21
# 可以将图片、视频、音频转换成base64（不带base64前缀，需要自己加前缀）
# 使用方法在下方


def ToBase64(file, txt):
    fileObj = open(file, 'rb')
    image_data = fileObj.read()
    base64_data = base64.b64encode(image_data)
    fout = open(txt, 'w')
    fout.write(base64_data.decode())
    fout.close()


# 使用方法：将要转换的文件放在此脚本所在文件夹
# ToBase64（）方法的第一个参数为要转换的文件路径名
# 转换结果存放在第二个参数里
ToBase64("./start.mp4", 'desk_base64.txt')