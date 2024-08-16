import os
import json
import torchaudio
import argparse
import random
raw_audio_dir = "./raw_audio/"
denoise_audio_dir = "./denoised_audio/"
filelist = list(os.walk(raw_audio_dir))[0][2]
# 2023/4/21: Get the target sampling rate
parser = argparse.ArgumentParser()
parser.add_argument("--name", default="barbara")
args = parser.parse_args()
with open("./configs/finetune_speaker.json", 'r', encoding='utf-8') as f:
    hps = json.load(f)
target_sr = hps['data']['sampling_rate']
for file in filelist:
    if file.endswith(".wav"):
        print(f'开始分离: {file} \n')
        os.system(f"demucs --two-stems=vocals {raw_audio_dir}{file}")
        # os.system(f".\python38\python.exe .\python38\Scripts\demucs.exe --two-stems=vocals {raw_audio_dir}{file}")
for file in filelist:
    file = file.replace(".wav", "")
    print(f'重采样{file}至匹配底模')
    wav, sr = torchaudio.load(f"./separated/htdemucs/{file}/vocals.wav", frame_offset=0, num_frames=-1, normalize=True,
                              channels_first=True)
    # merge two channels into one
    wav = wav.mean(dim=0).unsqueeze(0)
    if sr != target_sr:
        wav = torchaudio.transforms.Resample(orig_freq=sr, new_freq=target_sr)(wav)
    filename = args.name + "_" + str(random.randint(0, 1000000))
    torchaudio.save(denoise_audio_dir + filename + ".wav", wav, target_sr, channels_first=True)