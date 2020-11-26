#!/bin/env python
# -*- encoding=utf8 -*-

import os,sys,getopt,shutil,platform,urllib, urllib2
import zipfile
import datetime
import time
import ConfigParser
import ftplib
import base64
import platform
import tinify

tinify.key = "5ZBe2ebDJQ9iIujMCyLfRI3MowzMY1pU";
fs = os.path.sep;
sdkPathInCocosProject = "JodoH5Sdk"
uploadConfigName = "FacebookUploadConfig.ini"
configsDir = os.getcwd() + os.path.sep + sdkPathInCocosProject
dirProd = configsDir + os.path.sep + "Prod"
dirMock = configsDir + os.path.sep + "Mock"
dirTest = configsDir + os.path.sep + "Test"
fileName_Sdk_In_Dir = 'jodofun.sdk.js'
fileName_Sdk_Main = 'main-v1.js'
fileName_Sdk_Test = 'test.js'
fileName_App_Conifg = 'appconfig.js'
fileName_SDK_Version = 'config.sdkversion'
pythonToolVersion = '35'
facebookSdkVersion = '6.2'
cdnUrl = "http://10.10.0.19:22525"

def zip_dir(dirname, zipfilename):
  filelist = []
  if os.path.isfile(dirname):
    filelist.append(dirname)
  else:
    for root, dirs, files in os.walk(dirname):
      for name in files:
        filelist.append(os.path.join(root, name))

  zf = zipfile.ZipFile(zipfilename, "w", zipfile.zlib.DEFLATED)
  for tar in filelist:
    arcname = tar[len(dirname):]
    # print arcname
    zf.write(tar, arcname)
  zf.close()

def modifyFIle(file,old_str,new_str):
  f1 = open(file, 'r+')
  infos = f1.readlines()
  f1.seek(0, 0)
  for line in infos:
    line_new = line.replace(old_str, new_str)
    f1.write(line_new)
  f1.close()

def deleteRawZip(file_dir):
  L=[]
  for root, dirs, files in os.walk(file_dir):
    for file in files:
      if os.path.splitext(file)[1] == '.zip':
        os.remove(os.path.join(root, file))
  return L

def deleteSdkVersionFile(file_dir):
  L=[]
  for root, dirs, files in os.walk(file_dir):
    for file in files:
      if os.path.splitext(file)[1] == '.sdkversion':
        os.remove(os.path.join(root, file))
  return L

def del_file(path):
    ls = os.listdir(path)
    for i in ls:
        c_path = os.path.join(path, i)
        if os.path.isdir(c_path):
            del_file(c_path)
        else:
            os.remove(c_path)

def mycopyfile(srcfile,dstfile):
    if not os.path.isfile(srcfile):
        print "%s not exist!"%(srcfile)
    else:
        fpath,fname=os.path.split(dstfile)    #分离文件名和路径
        if not os.path.exists(fpath):
            os.makedirs(fpath)                #创建路径
        shutil.copyfile(srcfile,dstfile)      #复制文件
        print "copy %s -> %s"%( srcfile,dstfile)


def UploadZip(curlPath,file,appid,uploadToken,userName):
  nowTime = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
  sysstr = platform.system()
  targetUploadFile=''
  if sysstr == "Windows":
    print("file exit?")
    print(os.path.exists(file))
    print("--1")
    dj = str(file)
    print("--2")

    targetUploadFile=dj.replace('\\',"\\/")
    print(targetUploadFile)
  else:
    targetUploadFile=file
  cmd = curlPath+" -X POST https://graph-video.facebook.com/"+appid+"/assets -F 'access_token="+uploadToken+"' -F 'type=BUNDLE' -F 'asset=@"+targetUploadFile+"' -F 'comment="+userName+"upload at:"+nowTime+"'"
  print(cmd)
  # os.system(cmd)

def findAndUploadZip(curlPath,file_dir,appid,uploadToken,userName):
  print('--------------------------findAndUploadZip------------------------------')
  L=[]
  for root, dirs, files in os.walk(file_dir):
    for file in files:
      if os.path.splitext(file)[1] == '.zip':
        UploadZip(curlPath,os.path.join(root, file),appid,uploadToken,userName)
  return L

def modifZipAndUploadToFacebook(prod,ts,comment,prxName,currentTime):
  # 清除所以的zip包
  deleteRawZip(os.getcwd())
  productEnv = "";
  if prod:
    dirNeedToCopy = dirProd;
    productEnv = "Prod"
  else:
    dirNeedToCopy = dirTest;
    productEnv = "Test"
  # 在index.html中引入js
  dirFbBuild = os.getcwd() + fs + "build" + fs + "fb-instant-games"
  #modifyFIle(dirFbBuild + os.path.sep + "main.js", "<!--<link rel=\"apple-touch-icon\" href=\".png\" />-->",
   #          "<script src=\"./src/assets/" + fileName_Sdk_In_Dir + "\"></script>")
  #modifyFIle(dirFbBuild + os.path.sep + "main.js", "<!--<link rel=\"apple-touch-icon-precomposed\" href=\".png\" />-->",
   #          "<script src=\"./src/assets/" + fileName_App_Conifg + "\"></script>")

  modifyFIle(os.getcwd() + fs + "build" + fs + "fb-instant-games" + fs + "index.html", "https://connect.facebook.net/en_US/fbinstant.6.0.js","https://connect.facebook.net/en_US/fbinstant."+facebookSdkVersion+".js")
  # 拷贝sdk文件与配置文件
  mycopyfile(dirNeedToCopy + fs + fileName_Sdk_In_Dir,
             dirFbBuild + fs + 'src' + fs + 'assets' + fs + fileName_Sdk_In_Dir)
  configFilePath = dirFbBuild + fs + 'src' + fs + 'assets' + fs + fileName_App_Conifg
  mycopyfile(dirNeedToCopy + fs + fileName_App_Conifg,
             configFilePath)

  modifyFIle(configFilePath,"window.AppConfig = {","window.AppConfig = {\n\tversion:\""+currentTime+"\",");

  if os.path.exists(dirFbBuild + os.path.sep + "cocos2d-js-min.js"):
      mycopyfile(os.getcwd()+fs+sdkPathInCocosProject+fs+'main_progress.js',dirFbBuild+fs+'main.js')



  #获取sdk版本
  currentSdkFile = open(os.getcwd()+fs+sdkPathInCocosProject+fs+fileName_SDK_Version)
  currentSdkVersion = currentSdkFile.read()
  print('currentInstantSdkVersion:'+currentSdkVersion)
  print('facebookSdkVersion:' + facebookSdkVersion)
  currentSdkFile.close()


  # 重新打zip包
  zipFileName = prxName+"_g"+comment+"_"+ productEnv+"_s"+currentSdkVersion+"_tv"+pythonToolVersion + "_"+ts + ".zip"
  zipFilePath = os.getcwd() + fs + "build" + fs + "fb-instant-games" + fs + zipFileName
  zip_dir(os.getcwd() + fs + "build" + fs + "fb-instant-games", zipFilePath)

  # 把zip文件上传到ftp
  ftphost = '192.168.0.19'
  ftpusername = 'packfacebookuser'
  ftppassword = '3be13eaea74417f46'
  ftpConnect = ftplib.FTP(ftphost)  # 实例化FTP对象
  ftpConnect.login(ftpusername, ftppassword)  # 登录
  file_remote = zipFileName
  file_local = zipFilePath
  bufsize = 2048  # 设置缓冲器大小
  fp = open(file_local, 'rb')
  ftpConnect.storbinary('STOR ' + file_remote, fp, bufsize)
  ftpConnect.close()

  # 读取上传Facebook的配置
  facebookUploadconf = ConfigParser.ConfigParser()
  facebookUploadconf.read(configsDir + fs + uploadConfigName)  # 文件路径


  uploadFacebookId = facebookUploadconf.get(productEnv, "FacebookAppId")  # 获取指定section 的option值
  uploadFacebookToken = facebookUploadconf.get(productEnv, "FacebookUplosdToken")  # 获取指定section 的option值
  print (uploadFacebookId)
  print (uploadFacebookToken)
  # 请求这台机器，把zip上传到facebook
  curldata = {"appid": uploadFacebookId,
              "uploadToken": uploadFacebookToken,
              "filename": zipFileName, "comment": comment}
  curldata = urllib.urlencode(curldata)
  req = urllib2.Request("http://192.168.0.19:38888/index", curldata)
  resp = urllib2.urlopen(req)
  print resp.read()

def isImageFile(fileName):
    if fileName.endswith(".png") or fileName.endswith(".jpg") or fileName.endswith(".bmp")or fileName.endswith(".jpeg")or fileName.endswith(".git")or fileName.endswith(".ico")or fileName.endswith(".tiff")or fileName.endswith(".image"):
        return True;
    else:
        return False;

def isAudioFile(fileName):
    if fileName.endswith(".mp3") or fileName.endswith(".ogg")or fileName.endswith(".wav")or fileName.endswith(".m4a"):
        return True;
    else:
        return False;

def mapToJsStr(mapName,dicMap):
    strTmp="";
    for key in dicMap:
      if platform.system()=='windows':
          mapKey = key.replace('\\','/');
      else:
          mapKey = key;
      strTmp+="%s.set(\"%s\",\"%s\");" % (mapName, key.replace('\\','/'),dicMap[key])
    return strTmp;

def modifyJsCode(rawCode,mapName,targetMap):
    targetStr = "var "+mapName+" = new Map();"
    endStr = targetStr + mapToJsStr(mapName, targetMap)
    return rawCode.replace(targetStr, endStr)

def insertMapIntoCocosJs(cocosfilePath,hubString,mapdic,specialProcess):
    if mapdic.__len__()==0:
        return
    f = open(cocosfilePath);
    content = f.read();
    
    f.close();
    mapvarIndex = content.index(hubString)-1

    # 获取混淆后的map变量名字
    mapname = content[mapvarIndex];
    # print mapname;
    endStr = mapToJsStr(mapname,mapdic);

    if specialProcess :
        endStr = endStr[:-1]
        content = content.replace(mapname + hubString, endStr);
    else:
        content = content.replace(mapname+hubString,endStr);


    f = open(cocosfilePath, 'w')
    f.write(content)
    f.close()


def packageToOneHtml(combine):
    # base64JsCode = r'ICAgICAgICB2YXIgbWFwYXVkaW8gPSBuZXcgTWFwKCk7DQogICAgICAgIHZhciBtYXB0ZXh0ID0gbmV3IE1hcCgpOw0KICAgICAgICB2YXIgbWFwc2NyaXB0ID0gbmV3IE1hcCgpOw0KICAgICAgICB2YXIgbWFwaW1hZ2UgPSBuZXcgTWFwKCk7DQoNCiAgICAgICAgZnVuY3Rpb24gYmFzZTY0VG9CdWZmZXIgKGJ1ZmZlcikgew0KICAgICAgICAgICAgdmFyIGJpbmFyeSA9IHdpbmRvdy5hdG9iKGJ1ZmZlcik7DQogICAgICAgICAgICB2YXIgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGJpbmFyeS5sZW5ndGgpOw0KICAgICAgICAgICAgdmFyIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTsNCiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpICZsdDsgYnVmZmVyLmJ5dGVMZW5ndGg7IGkrKykgew0KICAgICAgICAgICAgICAgIGJ5dGVzW2ldID0gYmluYXJ5LmNoYXJDb2RlQXQoaSkgJiAweEZGOw0KICAgICAgICAgICAgfQ0KICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjsNCiAgICAgICAgfTsNCiAgICAgICAgZnVuY3Rpb24gc3RyRW5kV2l0aChzdHIsc3RyRW5kKXsNCiAgICAgICAgICB2YXIgZD1zdHIubGVuZ3RoLWVuZFN0ci5sZW5ndGg7DQogICAgICAgICAgcmV0dXJuIChkJmd0Oz0wJiZzdHIubGFzdEluZGV4T2YoZW5kU3RyKT09ZCkNCiAgICAgICAgfQ0KICAgICAgICBmdW5jdGlvbiBqZGF1ZGlvaGFuZGxlciAoaXRlbSwgY2FsbGJhY2spIHsNCiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gY2Muc3lzLl9fYXVkaW9TdXBwb3J0LmNvbnRleHQ7DQogICAgICAgICAgICB2YXIgZm9ybWF0U3VwcG9ydCA9IGNjLnN5cy5fX2F1ZGlvU3VwcG9ydC5mb3JtYXQ7DQogICAgICAgICAgICBpZiAoZm9ybWF0U3VwcG9ydC5sZW5ndGggPT09IDApIHsNCiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCYjMzk7QXVkaW8gRG93bmxvYWRlcjogYXVkaW8gbm90IHN1cHBvcnRlZCBvbiB0aGlzIGJyb3dzZXIhJiMzOTspOw0KICAgICAgICAgICAgfQ0KICAgICAgICAgICAgaXRlbS5jb250ZW50ID0gaXRlbS51cmw7DQoNCiAgICAgICAgICAgIGlmICghY2Muc3lzLl9fYXVkaW9TdXBwb3J0LldFQl9BVURJTyB8fCAoaXRlbS51cmxQYXJhbSAmJiBpdGVtLnVybFBhcmFtWyYjMzk7dXNlRG9tJiMzOTtdKSkgew0KICAgICAgICAgICAgICAgIGlmIChtYXBhdWRpby5oYXMoaXRlbS51cmwpKSB7DQogICAgICAgICAgICAgICAgICAgIHZhciBkb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCYjMzk7YXVkaW8mIzM5Oyk7DQogICAgICAgICAgICAgICAgICAgIHZhciBwcmV4ID0gIiI7DQogICAgICAgICAgICAgICAgICAgIGlmIChzdHJFbmRXaXRoKGl0ZW0udXJsLHdhdikpIHsNCiAgICAgICAgICAgICAgICAgICAgICAgIHByZXg9ImRhdGE6YXVkaW8veC13YXY7YmFzZTY0LCI7DQogICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmIChzdHJFbmRXaXRoKGl0ZW0udXJsLCYjMzk7b2dnJiMzOTspKSB7DQogICAgICAgICAgICAgICAgICAgICAgICBwcmV4PSJkYXRhOmF1ZGlvL29nZztiYXNlNjQsIjsNCiAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYgKHN0ckVuZFdpdGgoaXRlbS51cmwsJiMzOTttcDMmIzM5OykpIHsNCiAgICAgICAgICAgICAgICAgICAgICAgIHByZXg9ImRhdGE6YXVkaW8vbXAzO2Jhc2U2NCwiOw0KICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZiAoc3RyRW5kV2l0aChpdGVtLnVybCwmIzM5O200YSYjMzk7KSkgew0KICAgICAgICAgICAgICAgICAgICAgICAgcHJleD0iZGF0YTphdWRpby94LW00YTtiYXNlNjQsIjsNCiAgICAgICAgICAgICAgICAgICAgfWVsc2V7DQogICAgICAgICAgICAgICAgICAgICAgICBwcmV4PSJkYXRhOmF1ZGlvL3gtd2F2O2Jhc2U2NCwiOw0KICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgICAgIGRvbS5zcmMgPSBwcmV4K21hcGF1ZGlvLmdldChpdGVtLnVybCk7DQogICAgICAgICAgICAgICAgICAgIHZhciBjbGVhckV2ZW50ID0gZnVuY3Rpb24gKCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTsNCiAgICAgICAgICAgICAgICAgICAgICAgIGRvbS5yZW1vdmVFdmVudExpc3RlbmVyKCJjYW5wbGF5dGhyb3VnaCIsIHN1Y2Nlc3MsIGZhbHNlKTsNCiAgICAgICAgICAgICAgICAgICAgICAgIGRvbS5yZW1vdmVFdmVudExpc3RlbmVyKCJlcnJvciIsIGZhaWx1cmUsIGZhbHNlKTsNCiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNjLnN5cy5fX2F1ZGlvU3VwcG9ydC5VU0VfTE9BREVSX0VWRU5UKQ0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbS5yZW1vdmVFdmVudExpc3RlbmVyKGNjLnN5cy5fX2F1ZGlvU3VwcG9ydC5VU0VfTE9BREVSX0VWRU5ULCBzdWNjZXNzLCBmYWxzZSk7DQogICAgICAgICAgICAgICAgICAgIH07DQogICAgICAgICAgICAgICAgICAgIHZhciB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRvbS5yZWFkeVN0YXRlID09PSAwKQ0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWx1cmUoKTsNCiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKCk7DQogICAgICAgICAgICAgICAgICAgIH0sIDgwMDApOw0KICAgICAgICAgICAgICAgICAgICB2YXIgc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHsNCiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyRXZlbnQoKTsNCiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZWxlbWVudCA9IGRvbTsNCiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGl0ZW0udXJsKTsNCiAgICAgICAgICAgICAgICAgICAgfTsNCiAgICAgICAgICAgICAgICAgICAgdmFyIGZhaWx1cmUgPSBmdW5jdGlvbiAoKSB7DQogICAgICAgICAgICAgICAgICAgICAgICBjbGVhckV2ZW50KCk7DQogICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9ICYjMzk7bG9hZCBhdWRpbyBmYWlsdXJlIC0gJiMzOTsgKyBpdGVtLnVybDsNCiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmxvZyhtZXNzYWdlKTsNCiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG1lc3NhZ2UsIGl0ZW0udXJsKTsNCiAgICAgICAgICAgICAgICAgICAgfTsNCiAgICAgICAgICAgICAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoImNhbnBsYXl0aHJvdWdoIiwgc3VjY2VzcywgZmFsc2UpOw0KICAgICAgICAgICAgICAgICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcigiZXJyb3IiLCBmYWlsdXJlLCBmYWxzZSk7DQogICAgICAgICAgICAgICAgICAgIGlmKGNjLnN5cy5fX2F1ZGlvU3VwcG9ydC5VU0VfTE9BREVSX0VWRU5UKQ0KICAgICAgICAgICAgICAgICAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoY2Muc3lzLl9fYXVkaW9TdXBwb3J0LlVTRV9MT0FERVJfRVZFTlQsIHN1Y2Nlc3MsIGZhbHNlKTsgICAgICANCiAgICAgICAgICAgICAgICB9ZWxzZXsNCiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIm1hcGF1ZGlvIG5vdCBjb250YWluIDE6IitpdGVtLnVybCk7DQogICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgIA0KICAgICAgICAgICAgfQ0KICAgICAgICAgICAgZWxzZSB7DQogICAgICAgICAgICAgICAgaWYgKG1hcGF1ZGlvLmhhcyhpdGVtLnVybCkpIHsNCiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coImRqIGJnIG1wNSIpOw0KICAgICAgICAgICAgICAgICAgICB2YXIgdGVtID0gYmFzZTY0VG9CdWZmZXIobWFwYXVkaW8uZ2V0KGl0ZW0udXJsKSkNCiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coImRqIGJnIG1wNiIpOw0KICAgICAgICAgICAgICAgICAgICBjb250ZXh0WyJkZWNvZGVBdWRpb0RhdGEiXSh0ZW0sIGZ1bmN0aW9uKGJ1ZmZlcil7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zdWNjZXNzDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5idWZmZXIgPSBidWZmZXI7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgaXRlbS5pZCk7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coInByb2Nlc3MgZmluaXNoIDoiLGl0ZW0udXJsKTsNCiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9lcnJvcg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCYjMzk7ZGVjb2RlIGVycm9yIC0gJiMzOTsgKyBpdGVtLmlkLCBudWxsKTsNCiAgICAgICAgICAgICAgICAgICAgICAgIH0pOw0KICAgICAgICAgICAgICAgIH1lbHNlew0KICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygibWFwYXVkaW8gbm90IGNvbnRhaW4gMjoiK2l0ZW0udXJsKTsNCiAgICAgICAgICAgICAgICB9ICAgICAgICAgICANCiAgICAgICAgICAgIH0NCiAgICAgICAgICAgIA0KICAgICAgICB9DQogICAgICAgIA0KICAgICAgICBmdW5jdGlvbiBqZHRleHRoYW5kbGVyKGl0ZW0sIGNhbGxiYWNrKXsNCiAgICAgICAgICAgIGlmIChtYXB0ZXh0LmhhcyhpdGVtLnVybCkpIHsNCiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB3aW5kb3cuYXRvYihtYXB0ZXh0LmdldChpdGVtLnVybCkpOw0KICAgICAgICAgICAgfQ0KICAgICAgICAgICAgZWxzZXsNCiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygibWFwdGV4dCBub3QgY29udGFpbiA6IitpdGVtLnVybCk7DQogICAgICAgICAgICB9ICAgICAgICAgICAgDQogICAgICAgIH0NCg0KICAgICAgICBmdW5jdGlvbiBqZHNjcmlwdGhhbmRsZXIoaXRlbSwgY2FsbGJhY2ssIGlzQXN5bmMpew0KICAgICAgICAgICAgdmFyIHVybCA9IGl0ZW0udXJsLA0KICAgICAgICAgICAgICAgIGQgPSBkb2N1bWVudCwNCiAgICAgICAgICAgICAgICBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgmIzM5O3NjcmlwdCYjMzk7KTsNCiAgICAgICAgICAgIHMuYXN5bmMgPSBpc0FzeW5jOyAgICAgICAgICAgIA0KICAgICAgICAgICAgY29uc29sZS5sb2coImpkc2NyaXB0aGFuZGxlcjoiLHVybCk7DQogICAgICAgICAgICBpZiAobWFwc2NyaXB0LmhhcyhpdGVtLnVybCkpIHsNCiAgICAgICAgICAgICAgICBzLmlubmVySFRNTD13aW5kb3cuYXRvYihtYXBzY3JpcHQuZ2V0KGl0ZW0udXJsKSk7DQogICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXJsKTsNCiAgICAgICAgICAgICAgICBkLmJvZHkuYXBwZW5kQ2hpbGQocyk7DQogICAgICAgICAgICB9ZWxzZXsNCiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygibWFwc2NyaXB0IG5vdCBjb250YWluIDoiK2l0ZW0udXJsKTsNCiAgICAgICAgICAgIH0gICAgICAgICAgICANCiAgICAgICAgfQ0KDQogICAgICAgIGZ1bmN0aW9uIGpkZG93bmxvYWRJbWFnZSAoaXRlbSwgY2FsbGJhY2ssIGlzQ3Jvc3NPcmlnaW4sIGltZykgeyAgICAgICAgICAgIA0KICAgICAgICAgICAgaW1nID0gbmV3IEltYWdlKCk7DQogICAgICAgICAgICBpZiAobWFwaW1hZ2UuaGFzKGl0ZW0udXJsKSkgew0KICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCJkanNldCBpbWFnZSIpOw0KICAgICAgICAgICAgICAgIGltZy5zcmM9bWFwaW1hZ2UuZ2V0KGl0ZW0udXJsKTsNCiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygiZGpzZXQgc2Rmc2YiKTsNCiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBpbWcpOw0KICAgICAgICAgICAgfWVsc2V7DQogICAgICAgICAgICAgICAgY29uc29sZS5sb2coIm1hcGltYWdlIG5vdCBjb250YWluIDoiK2l0ZW0udXJsKTsNCiAgICAgICAgICAgIH0NCiAgICAgICAgfQ0KDQogICAgICAgIGNjLmxvYWRlci5hZGREb3dubG9hZEhhbmRsZXJzKHsNCiAgICAgICAgICAvLyBUaGlzIHdpbGwgbWF0Y2ggYWxsIHVybCB3aXRoIGAuc2NlbmVgIGV4dGVuc2lvbiBvciBhbGwgdXJsIHdpdGggYHNjZW5lYCB0eXBlDQoNCiAgICAgICAgICAgIC8vIEpTDQogICAgICAgICAgICAmIzM5O2pzJiMzOTsgOiBqZHNjcmlwdGhhbmRsZXIsDQoNCiAgICAgICAgICAgICYjMzk7anNvbiYjMzk7IDogamR0ZXh0aGFuZGxlciwNCiAgICAgICAgICAgIC8vIFR4dA0KICAgICAgICAgICAgJiMzOTt0eHQmIzM5OyA6IGpkdGV4dGhhbmRsZXIsDQogICAgICAgICAgICAmIzM5O3htbCYjMzk7IDogamR0ZXh0aGFuZGxlciwNCiAgICAgICAgICAgICYjMzk7dnNoJiMzOTsgOiBqZHRleHRoYW5kbGVyLA0KICAgICAgICAgICAgJiMzOTtmc2gmIzM5OyA6IGpkdGV4dGhhbmRsZXIsDQogICAgICAgICAgICAmIzM5O2F0bGFzJiMzOTsgOiBqZHRleHRoYW5kbGVyLA0KDQogICAgICAgICAgICAvLyBJbWFnZXMNCiAgICAgICAgICAgICYjMzk7cG5nJiMzOTsgOiBqZGRvd25sb2FkSW1hZ2UsDQogICAgICAgICAgICAmIzM5O2pwZyYjMzk7IDogamRkb3dubG9hZEltYWdlLA0KICAgICAgICAgICAgJiMzOTtibXAmIzM5OyA6IGpkZG93bmxvYWRJbWFnZSwNCiAgICAgICAgICAgICYjMzk7anBlZyYjMzk7IDogamRkb3dubG9hZEltYWdlLA0KICAgICAgICAgICAgJiMzOTtnaWYmIzM5OyA6IGpkZG93bmxvYWRJbWFnZSwNCiAgICAgICAgICAgICYjMzk7aWNvJiMzOTsgOiBqZGRvd25sb2FkSW1hZ2UsDQogICAgICAgICAgICAmIzM5O3RpZmYmIzM5OyA6IGpkZG93bmxvYWRJbWFnZSwNCiAgICAgICAgICAgICYjMzk7d2VicCYjMzk7IDogamRkb3dubG9hZEltYWdlLA0KICAgICAgICAgICAgJiMzOTtpbWFnZSYjMzk7IDogamRkb3dubG9hZEltYWdlLA0KICAgICAgICAgICAgLy8gQXVkaW8NCiAgICAgICAgICAgICYjMzk7bXAzJiMzOTsgOiBqZGF1ZGlvaGFuZGxlciwNCiAgICAgICAgICAgICYjMzk7b2dnJiMzOTsgOiBqZGF1ZGlvaGFuZGxlciwNCiAgICAgICAgICAgICYjMzk7d2F2JiMzOTsgOiBqZGF1ZGlvaGFuZGxlciwNCiAgICAgICAgICAgICYjMzk7bTRhJiMzOTsgOiBqZGF1ZGlvaGFuZGxlciwNCiAgICAgICAgfSk7';
    # JsCode = base64.b64decode(base64JsCode);


    dirWebBuild = os.getcwd() + fs + "build" + fs + "web-mobile"

    dirSrc = dirWebBuild+fs+"src"
    dirRes = dirWebBuild + fs + "res"
    # downloader.js  --
    print "start read maps";
    dicScript={}
    dicJson = {};
    dicImage = {};
    dicAudio = {};
    if(os.path.exists(dirSrc)):
        for (root, dirs, files) in os.walk(dirSrc):
            for filename in files:
                if filename != ".DS_Store":
                    temfilePath = os.path.join(root, filename)
                    # print temfilePath
                    mapKey = temfilePath[dirWebBuild.__len__()+1:]
                    fileContent = open(temfilePath).read()
                    # print mapKey
                    mapValue = base64.b64encode(fileContent)
                    # print mapValue
                    dicScript[mapKey] = mapValue;



    if (os.path.exists(dirRes)):
        for (root, dirs, files) in os.walk(dirRes):
            for filename in files:
                if filename != ".DS_Store":
                    temfilePath = os.path.join(root, filename)
                    # print temfilePath
                    mapKey = temfilePath[dirWebBuild.__len__()+1:]
                    if(filename.endswith(".json")):
                        f = open(temfilePath)
                        temStr  = f.read();
                        temStr = temStr.replace("\\", "\\\\")
                        temStr = temStr.replace("\"", "\\\"")
                        dicJson[mapKey] = temStr;
                        print mapKey;
                        f.close()
                    elif (filename.endswith(".plist")):
                        f = open(temfilePath)
                        temStr = f.read();

                        dicJson[mapKey] = base64.b64encode(temStr);
                        f.close()
                    elif(isImageFile(filename)):
                        if(filename.find("AutoAtlas")>-1):
                            tinyPng(temfilePath);
                        imagePrex="";
                        if filename.endswith("png"):
                            imagePrex = "data:image/png;base64,"
                        elif filename.endswith("jpeg"):
                            imagePrex = "data:image/jpeg;base64,"
                        elif filename.endswith("jpg"):
                            imagePrex = "data:image/jpg;base64,"
                        elif filename.endswith("gif"):
                            imagePrex = "data:image/gif;base64,"
                        elif filename.endswith("bmp"):
                            imagePrex = "data:image/bmp;base64,"
                        elif filename.endswith("ico"):
                            imagePrex = "data:image/ico;base64,"
                        elif filename.endswith("tiff"):
                            imagePrex = "data:image/tiff;base64,"
                        elif filename.endswith("image"):
                            imagePrex = "data:image/image;base64,"

                        f = open(temfilePath,'rb')
                        dicImage[mapKey] = imagePrex+base64.b64encode(f.read());
                        # print mapKey
                        # print dicImage[mapKey]
                        f.close()
                    elif (isAudioFile(filename)):
                        f = open(temfilePath, 'rb')
                        dicAudio[mapKey] = base64.b64encode(f.read());
                        f.close()
                    else:
                        print "knowFile--"+filename;
    print "finish read maps ";
    print "audio map size:"+str(dicAudio.__len__())
    print "text map size:" + str(dicJson.__len__())
    print "image map size:" + str(dicImage.__len__())
    print "script map size:" + str(dicScript.__len__())


    cocosFilePath = dirWebBuild+fs+"cocos2d-js-min.js"
    scriptStringHub = ".set(\"scriptStringHub\",\"scriptStringHub\")";
    imageStringHub = ".set(\"imageStringHub\",\"imageStringHub\")";
    textStringHub = ".set(\"textStringHub\",\"textStringHub\")";
    audioStringHub = ".set(\"audioStringHub\",\"audioStringHub\")";

    print "start process hub script"
    insertMapIntoCocosJs(cocosFilePath,scriptStringHub,dicScript,False)
    print "start process hub image"
    insertMapIntoCocosJs(cocosFilePath, imageStringHub, dicImage,False)
    print "start process hub text"
    insertMapIntoCocosJs(cocosFilePath, textStringHub, dicJson,False)
    print "start process hub audio"
    insertMapIntoCocosJs(cocosFilePath, audioStringHub, dicAudio,True)

    print "process hubs finsh"


    if combine:
        print "start combine"
        f = open(cocosFilePath)
        cocos2d = f.read();
        f.close()
        cocos2d = "<script type=\"text/javascript\">"+cocos2d+"</script>";

        hubmain = "<script src=\"main.js\" charset=\"utf-8\"></script>"

        # modify main.js
        f = open(dirWebBuild+fs+"main.js")
        mainjs = f.read();
        f.close()
        strhub = "cocos2d.src = window._CCSettings.debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js';"
        mainjs = mainjs.replace(strhub, "")
        mainjs = mainjs.replace("document.body.appendChild(cocos2d);", "boot();")
        f = open(dirWebBuild+fs+"main.js", 'w')
        f.write(mainjs)
        f.close()

        f = open(dirWebBuild + fs + "src"+fs+"settings.js")
        setting = f.read();
        # print setting
        f.close()

        f = open(dirWebBuild + fs + "src" + fs + "project.js")
        project = f.read();
        # print project
        f.close()

        f = open(dirWebBuild + fs + "index.html")
        index = f.read();
        f.close()

        index = index.replace("<script src=\"src/settings.js\" charset=\"utf-8\"></script>", "<script charset=\"utf-8\">console.log(\"FbPlayableAd.onCTAClick();\");"+setting+"</script>")
        index = index.replace(hubmain,cocos2d+"<script charset=\"utf-8\">" + mainjs + "</script>")
        f = open(dirWebBuild + fs + "index.html", 'w')
        f.write(index)
        f.close()
        print "start process style"
        f = open(dirWebBuild + fs + "style-mobile.css")
        stylecontent = f.read();
        f.close()

        f = open(dirWebBuild + fs + "index.html")
        index = f.read();
        f.close()

        index = index.replace("<link rel=\"stylesheet\" type=\"text/css\" href=\"style-mobile.css\"/>","<style>"+stylecontent+"</style>");
        index = index.replace("#171717 url(./splash.png)","#171717");#清除开场cocos动画
        f = open(dirWebBuild + fs + "index.html", 'w')
        f.write(index)
        f.close()

def tinyPng(filePath):
  source = tinify.from_file(filePath)
  source.to_file(filePath)
  print "successfully tinify: " + os.path.basename(filePath)
















def main(argv):

   currentPyName = sys.argv[0]
   print("currentPyName")
   print(currentPyName)
   try:
      opts, args = getopt.getopt(argv[1:],"cmtuvp",["appId=","appToken="])
   except getopt.GetoptError:
      print 'python instantConfig.py -v (查看工具版本)'
      print 'python instantConfig.py -u (升级工具)'
      print 'python instantConfig.py -c sdkVersion (创建配置或更新js sdk)'
      print 'python instantConfig.py -m 备注 (打包上传)'
      print 'python instantConfig.py -p (打成一个html)'
      sys.exit(2)
   action =""
   env =""
   for opt, arg in opts:
      if opt == '-v':
         print ("-v")
         print('pythonToolVersion:'+pythonToolVersion)
         return
      elif opt == '-c':
         print ("-c")
         print('pythonToolVersion:' + pythonToolVersion)
         action='-c'
      elif opt == '-u':
         print ("-u")
         print('pythonToolVersion-start update,from version' + pythonToolVersion)
         action='-u'
      elif opt == '-p':
         print ("-p")
         action='-p'
      elif opt == '-m':
         print ("-m")
         print('pythonToolVersion:' + pythonToolVersion)
         action='-m'
         continue
      elif opt == '-t':
        targetPath = args[0]
        print("targetPath")
        print(targetPath)
        print("arg2")
        print(targetPath + os.path.sep + os.path.split(__file__)[-1])
        shutil.copyfile(currentPyName,targetPath + os.path.sep+ os.path.split(__file__)[-1])
        sys.exit()

   if action == '-m':
       temcomment = ""
       currentTime = time.time()
       # localtime = time.strftime('%Y-%m-%d-%H:%M', currentTime)
       localtime = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
       ts = str(int(currentTime))

       if len(args) == 0:
           temcomment = "comment"
       else:
           temcomment = args[0]

       temprex = "fb_"
       if len(args) == 1:
           print("args1")
           temcomment = args[0]
           print (temcomment)
           modifZipAndUploadToFacebook(True, ts, temcomment, temprex,localtime)
           modifZipAndUploadToFacebook(False, ts, temcomment, temprex,localtime)
       elif len(args) == 2:
          temcomment = args[1]
          if (args[0] == "t"):
               print("args2t")
               modifZipAndUploadToFacebook(True, ts, temcomment, temprex,localtime)
          elif (args[0] == "p"):
               print("args2p")
               modifZipAndUploadToFacebook(False, ts, temcomment, temprex,localtime)
          else:
               print (
               "no environment:" + args[1] + "--please input \"t\": for test environment or \"p\" for prod environment")
       else:
          print("please input python instantConfig -m \"备注\"")
           
       sys.exit()
   elif action == '-u':
       urllib.urlretrieve(cdnUrl + "/" + 'instantConfig.py',
                          os.getcwd() + fs + 'instantConfig.py')
   elif action == '-p':
       packageToOneHtml(True)
       sys.exit()
   elif action == '-c':
     print("start to make JodoH5Sdk dir")
     if len(args) ==0:
         print ("please enter JodoH5Sdk version")
         sys.exit(2)
     version = args[0]


     urlHttp = cdnUrl;
     urlWithVersion = urlHttp;
     if os.path.exists(dirProd)==False:
        os.makedirs(dirProd)
     if os.path.exists(dirMock) == False:
        os.makedirs(dirMock)
     if os.path.exists(dirTest) == False:
        os.makedirs(dirTest)

     urllib.urlretrieve(urlWithVersion + "/" + 'main_progress.js', os.getcwd()+fs+sdkPathInCocosProject +fs+'main_progress.js')

     #main test mock
     urllib.urlretrieve(urlWithVersion+ "/" + 'main_'+version+".js", dirProd+fs+ fileName_Sdk_In_Dir)
     urllib.urlretrieve(urlWithVersion + "/" + 'main_' + version + ".js", dirProd + fs + fileName_Sdk_In_Dir)
     mycopyfile(dirProd+fs+ fileName_Sdk_In_Dir , dirTest+ fs + fileName_Sdk_In_Dir)
     urllib.urlretrieve(urlWithVersion + "/" +  'test_'+version+".js",dirMock + fs + fileName_Sdk_In_Dir)

     # main test mock
     urllib.urlretrieve(urlWithVersion + "/" + 'appconfig_'+version+".js", dirMock + fs + fileName_App_Conifg)
     if os.path.exists(dirProd + fs + fileName_App_Conifg)==False:
         mycopyfile(dirMock + fs + fileName_App_Conifg, dirProd + fs + fileName_App_Conifg)
     if os.path.exists(dirTest + fs + fileName_App_Conifg) == False:
         mycopyfile(dirMock + fs + fileName_App_Conifg, dirTest + fs + fileName_App_Conifg)

     if os.path.exists(configsDir + fs + uploadConfigName) == False:
         urllib.urlretrieve(urlWithVersion + "/" + uploadConfigName, configsDir + fs + uploadConfigName)

     deleteSdkVersionFile(os.getcwd()+fs+sdkPathInCocosProject)
     fileSdkVersion = open(os.getcwd()+fs+sdkPathInCocosProject +fs+fileName_SDK_Version, 'w')
     fileSdkVersion.write(version)
     fileSdkVersion.close()
     print("success!!! current sdk version is "+version)
     sys.exit()
   else:
     print ('some thing wrong,do nothing -c create config')
     sys.exit(2)
   print '输入的文件为：', inputfile
   print '输出的文件为：', outputfile



if __name__ == "__main__":
   main(sys.argv)