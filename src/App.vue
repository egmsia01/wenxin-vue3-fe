<template>
  <div id="app">
    <div class="chat-container">

      <!-- 模型选择 -->
      <div class="model-select">
        <label for="model">选择模型: </label>
        <el-select v-model="selectedModel" @change="updateUrl" id="model">
          <el-option label="ErnieBot" value="ErnieBot"></el-option>
          <el-option label="ErnieBot-Turbo" value="ErnieBot-Turbo"></el-option>
          <el-option label="BloomZ-7B" value="BloomZ-7B"></el-option>
        </el-select>
      </div>

      <div class="chat-box">
        <!-- Display Messages -->
        <el-scrollbar wrap-class="message-list">
          <el-card v-for="message in messages" :key="message.id" class="message-card">
            <template #header>
              <img v-if="message.isUser" class="avatar" src="/user-avatar.jpg" />
              <img v-else class="avatar" src="/wenxin.png" />
            </template>
            <div class="message-content" v-html="parseMarkdown(message.text)" />
          </el-card>
        </el-scrollbar>
      </div>

      <!-- Input Box -->
      <div class="input-container">
        <el-input
            v-model="newMessage"
            @keydown="handleKeyDown"
            @focus="isInputFocused = true"
            @blur="isInputFocused = false"
            placeholder="请输入消息..."
            :class="{'focused': isInputFocused}"
            class="input-height resizable-textarea"
            type="textarea"
            autosize
        />
        <el-button
            :loading="isSending"
            @click="sendMessage"
            type="primary"
            class="send-button"
        >
          发送
        </el-button>
      </div>

    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import MarkdownIt from '@alias/markdown-it';
import { ElSelect, ElOption, ElButton, ElInput, ElLoading } from 'element-plus';

export default {
  components: {
    ElSelect,
    ElOption,
    ElButton,
    ElInput,
    ElLoading,
  },

  setup() {
    const messages = ref([]);
    const newMessage = ref('');
    const selectedModel = ref('ErnieBot-Turbo');
    const apiUrl = ref('http://localhost:7529/api/turbo/param/chats');
    const isInputFocused = ref(false);
    const isSending = ref(false);

    let userId = Math.floor(Math.random() * 900000) + 100000;

    const parseMarkdown = (text) => {
      const md = new MarkdownIt();
      return md.render(text);
    };

    const updateUrl = () => {
      if (selectedModel.value === 'ErnieBot') {
        apiUrl.value = 'http://localhost:7529/api/ernie/param/chats';
      } else if (selectedModel.value === 'ErnieBot-Turbo') {
        apiUrl.value = 'http://localhost:7529/api/turbo/param/chats';
      } else if (selectedModel.value === 'BloomZ-7B') {
        apiUrl.value = 'http://localhost:7529/api/bloomz7b/param/chats';
      }
    };

    const sendMessage = async () => {
      if (!newMessage.value.trim()) return;

      isSending.value = true;

      messages.value.push({
        id: Date.now(),
        text: newMessage.value,
        isUser: true,
      });

      const response = await fetch(apiUrl.value, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          content: newMessage.value,
        }),
      });

      const data = await response.json();

      messages.value.push({
        id: Date.now(),
        text: data.data.result,
        isAssistant: true,
      });

      newMessage.value = '';
      isSending.value = false;
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.altKey) {
        event.preventDefault();
        sendMessage();
      } else if (event.key === 'Enter' && event.altKey) {
        newMessage.value += '\n';
      }
    };

    return {
      messages,
      newMessage,
      selectedModel,
      parseMarkdown,
      updateUrl,
      sendMessage,
      handleKeyDown,
      isInputFocused,
      isSending,
    };
  },
};
</script>

<style scoped>
.chat-container {
  max-width: 1080px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 95vh;
}
.el-card__body {
  padding: 10px;
}
.chat-box {
  flex: 1;
  overflow-y: auto;
}
.input-container {
  display: flex;
  align-items: center;
}
.message-list {
  max-height: calc(90vh - 100px);
  padding: 10px;
  box-sizing: border-box;
}
.message-card {
  margin-bottom: 10px;
  padding: 1px;
  width: 99%;
}

.model-select {
  margin-bottom: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin-right: 10px;
}

.message-card::v-deep .el-card__header {
  padding-top: 7px;
  padding-bottom: 5px;
  padding-left: 7px;
}

.input-height {
  width: 100%;
  font-size: 14px;
  border-radius: 10px;
  align-items: center;
}

.send-button {
  min-height: 20px;
  margin-left: 10px;
  border-radius: 10px;
}

</style>