<template>
  <el-container class="top is-dark">
    <el-dialog title="发布" :visible.sync="form.dialogVisible">
      <div class="postInfo">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="封面">
            <el-input
              v-model="form.thumb"
              placeholder="自动提取第一张图"
            ></el-input>
          </el-form-item>
          <el-form-item label="标题">
            <el-input
              v-model="form.title"
              placeholder="自动提取第一个标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              type="textarea"
              :rows="4"
              v-model="form.desc"
              placeholder="自动提取第一个段落"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="info">
              注：此功能由第三方浏览器插件支持，本平台不保证安全性。
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="form.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="post">确 定</el-button>
      </span>
    </el-dialog>
    <div class="left-side">
      <!-- 图片上传 -->
      <el-tooltip :effect="effect" content="上传图片" placement="bottom-start">
        <i
          class="el-icon-upload"
          size="medium"
          @click="$emit('show-dialog-upload-img')"
        ></i>
      </el-tooltip>
      <!-- 导出 Markdown 文档 -->
      <el-tooltip
        class="header__item"
        :effect="effect"
        content="导出 Markdown 文档"
        placement="bottom-start"
      >
        <i
          class="el-icon-download"
          size="medium"
          @click="$emit('download')"
        ></i>
      </el-tooltip>
      <!-- 导出 HTML -->
      <el-tooltip
        class="header__item"
        :effect="effect"
        content="导出 HTML 页面"
        placement="bottom-start"
      >
        <i class="el-icon-document" size="medium" @click="$emit('export')"></i>
      </el-tooltip>
      <!-- 样式重置 -->
      <el-tooltip
        class="header__item"
        :effect="effect"
        content="重置样式"
        placement="bottom-start"
      >
        <i
          class="el-icon-refresh"
          size="medium"
          @click="showResetConfirm = true"
        ></i>
      </el-tooltip>
      <!-- 插入表格 -->
      <el-tooltip
        class="header__item header__item_last"
        :effect="effect"
        content="插入表格"
        placement="bottom-start"
      >
        <i
          class="el-icon-s-grid"
          size="medium"
          @click="$emit('show-dialog-form')"
        ></i>
      </el-tooltip>
      <el-select
        v-model="selectFont"
        size="mini"
        placeholder="选择字体"
        clearable
        @change="fontChanged"
      >
        <el-option
          v-for="font in config.builtinFonts"
          :style="{ fontFamily: font.value }"
          :key="font.value"
          :label="font.label"
          :value="font.value"
        >
          <span class="select-item-left">{{ font.label }}</span>
          <span class="select-item-right">Abc</span>
        </el-option>
      </el-select>
      <el-select
        v-model="selectSize"
        size="mini"
        placeholder="选择段落字号"
        clearable
        @change="sizeChanged"
      >
        <el-option
          v-for="size in config.sizeOption"
          :key="size.value"
          :label="size.label"
          :value="size.value"
        >
          <span class="select-item-left">{{ size.label }}</span>
          <span class="select-item-right">{{ size.desc }}</span>
        </el-option>
      </el-select>
      <el-select
        v-model="selectColor"
        size="mini"
        placeholder="选择颜色"
        clearable
        @change="colorChanged"
      >
        <el-option
          v-for="color in config.colorOption"
          :key="color.value"
          :label="color.label"
          :value="color.value"
        >
          <span class="select-item-left">{{ color.label }}</span>
          <span class="select-item-right">{{ color.desc }}</span>
        </el-option>
      </el-select>
      <el-select
        v-model="selectCodeTheme"
        size="mini"
        placeholder="代码主题"
        @change="codeThemeChanged"
      >
        <el-option
          v-for="code in config.codeThemeOption"
          :key="code.value"
          :label="code.label"
          :value="code.value"
        >
          <span class="select-item-left">{{ code.label }}</span>
          <span class="select-item-right">{{ code.desc }}</span>
        </el-option>
      </el-select>
      <el-tooltip content="自定义颜色" :effect="effect" placement="top">
        <el-color-picker
          v-model="selectColor"
          size="mini"
          show-alpha
          @change="colorChanged"
        ></el-color-picker>
      </el-tooltip>
      <el-tooltip
        content="微信外链自动转为文末引用"
        :effect="effect"
        placement="top"
      >
        <el-switch
          class="header__switch"
          v-model="citeStatus"
          active-color="#67c23a"
          inactive-color="#dcdfe6"
          @change="statusChanged"
        >
        </el-switch>
      </el-tooltip>
    </div>
    <div class="right-side">
      <el-tooltip
        class="item"
        :effect="effect"
        content="自定义CSS样式"
        placement="left"
      >
        <el-button
          :type="btnType"
          plain
          size="medium"
          icon="el-icon-setting"
          @click="customStyle"
        ></el-button>
      </el-tooltip>
      <el-button
        :type="btnType"
        plain
        size="medium"
        @click="copy"
        placement="bottom-start"
        >复制</el-button
      >
      <!--
      <el-button
        :type="btnType"
        plain
        size="medium"
        @click="prePost"
        placement="bottom-start"
        >发布</el-button
      >
      -->
      <el-button
        :type="btnType"
        plain
        size="medium"
        class="about"
        @click="$emit('show-about-dialog')"
        >关于</el-button
      >
      <el-tooltip
        :content="btnContent"
        :effect="effect"
        placement="bottom-start"
      >
        <div
          class="mode__switch mode__switch_black"
          v-if="nightMode"
          @click="themeChanged"
        ></div>
        <div class="mode__switch" v-else @click="themeChanged"></div>
      </el-tooltip>
    </div>
    <resetDialog
      :showResetConfirm="showResetConfirm"
      @confirm="confirmReset"
      @close="cancelReset"
    />
  </el-container>
</template>

<script>
import {
  setFontSize,
  fixCodeWhiteSpace,
  setColorWithCustomTemplate,
} from '../../assets/scripts/util'
import { solveWeChatImage, solveHtml } from '../../assets/scripts/converter'
import config from '../../assets/scripts/config'
import DEFAULT_CSS_CONTENT from '@/assets/example/theme-css.txt'
import resetDialog from './resetDialog'
import { mapState, mapMutations } from 'vuex'
export default {
  name: `editor-header`,
  data() {
    return {
      form: {
        dialogVisible: false,
        title: ``,
        desc: ``,
        thumb: ``,
        content: ``,
      },
      config: config,
      citeStatus: false,
      showResetConfirm: false,
      selectFont: ``,
      selectSize: ``,
      selectColor: ``,
      selectCodeTheme: config.codeThemeOption[0].value,
    }
  },
  components: {
    resetDialog,
  },
  computed: {
    effect() {
      return this.nightMode ? `dark` : `light`
    },
    btnContent() {
      return this.nightMode ? `浅色模式` : `暗黑模式`
    },
    btnType() {
      return this.nightMode ? `default` : `primary`
    },
    ...mapState({
      output: (state) => state.output,
      editor: (state) => state.editor,
      cssEditor: (state) => state.cssEditor,
      currentFont: (state) => state.currentFont,
      currentSize: (state) => state.currentSize,
      currentColor: (state) => state.currentColor,
      codeTheme: (state) => state.codeTheme,
      nightMode: (state) => state.nightMode,
      currentCiteStatus: (state) => state.citeStatus,
    }),
  },
  methods: {
    prePost() {
      let auto = {}
      try {
        auto = {
          thumb: document.querySelector(`#output img`).src,
          title: [1, 2, 3, 4, 5, 6]
            .map((h) => document.querySelector(`#output h${h}`))
            .filter((h) => h)[0].innerText,
          desc: document.querySelector(`#output p`).innerText,
          content: this.output,
        }
      } catch (error) {
        console.log(`error`, error)
      }
      this.form = {
        dialogVisible: true,
        ...auto,
        auto,
      }
    },
    post() {
      this.form.dialogVisible = false
      // 使用 window.$syncer 可以检测是否安装插件
      window.syncPost({
        title: this.form.title || this.form.auto.title,
        desc: this.form.desc || this.form.auto.desc,
        content: this.form.content || this.form.auto.content,
        thumb: this.form.thumb || this.form.auto.thumb,
      })
    },
    fontChanged(fonts) {
      this.setWxRendererOptions({
        fonts: fonts,
      })
      this.setCurrentFont(fonts)
      this.$emit(`refresh`)
    },
    sizeChanged(size) {
      let theme = setFontSize(size.replace(`px`, ``))
      theme = setColorWithCustomTemplate(theme, this.currentColor)
      this.setWxRendererOptions({
        size: size,
        theme: theme,
      })
      this.setCurrentSize(size)
      this.$emit(`refresh`)
    },
    colorChanged(color) {
      let theme = setFontSize(this.currentSize.replace(`px`, ``))

      theme = setColorWithCustomTemplate(theme, color)
      this.setWxRendererOptions({
        theme: theme,
      })
      this.setCurrentColor(color)
      this.$emit(`refresh`)
    },
    codeThemeChanged(theme) {
      this.setCurrentCodeTheme(theme)
      this.$emit(`refresh`)
    },
    statusChanged(val) {
      this.setCiteStatus(val)
      this.$emit(`refresh`)
    },
    // 复制到微信公众号
    copy(e) {
      this.$emit(`startCopy`)
      setTimeout(() => {
        let clipboardDiv = document.getElementById(`output`)
        solveWeChatImage()
        solveHtml()
        clipboardDiv.focus()
        window.getSelection().removeAllRanges()
        let range = document.createRange()

        range.setStartBefore(clipboardDiv.firstChild)
        range.setEndAfter(clipboardDiv.lastChild)
        window.getSelection().addRange(range)
        document.execCommand(`copy`)
        window.getSelection().removeAllRanges()
        clipboardDiv.innerHTML = this.output
        // 输出提示
        this.$notify({
          showClose: true,
          message: `已复制渲染后的文章到剪贴板，可直接到微信公众号后台粘贴`,
          offset: 80,
          duration: 1600,
          type: `success`,
        })
        this.$emit(`refresh`)
        this.$emit(`endCopy`)
      }, 350)
    },
    // 自定义CSS样式
    async customStyle() {
      this.$emit(`showCssEditor`)
      this.$nextTick(() => {
        if (!this.cssEditor) {
          this.cssEditor.refresh()
        }
      })
      setTimeout(() => {
        this.cssEditor.refresh()
      }, 50)

      let flag = await localStorage.getItem(`__css_content`)
      if (!flag) {
        this.setCssEditorValue(DEFAULT_CSS_CONTENT)
      }
    },
    // 重置样式
    confirmReset() {
      localStorage.clear()
      this.cssEditor.setValue(DEFAULT_CSS_CONTENT)
      this.citeStatus = false
      this.statusChanged(false)
      this.fontChanged(this.config.builtinFonts[0].value)
      this.colorChanged(this.config.colorOption[0].value)
      this.sizeChanged(this.config.sizeOption[2].value)
      this.codeThemeChanged(this.config.codeThemeOption[0].value)
      this.$emit(`cssChanged`)
      this.selectFont = this.currentFont
      this.selectSize = this.currentSize
      this.selectColor = this.currentColor
      this.showResetConfirm = false
      this.selectCodeTheme = this.codeTheme
    },
    cancelReset() {
      this.showResetConfirm = false
      this.editor.focus()
    },
    ...mapMutations([
      `setCurrentColor`,
      `setCiteStatus`,
      `themeChanged`,
      `setCurrentFont`,
      `setCurrentSize`,
      `setCssEditorValue`,
      `setCurrentCodeTheme`,
      `setWxRendererOptions`,
    ]),
  },
  mounted() {
    this.selectFont = this.currentFont
    this.selectSize = this.currentSize
    this.selectColor = this.currentColor
    this.selectCodeTheme = this.codeTheme
    this.citeStatus = this.currentCiteStatus
  },
}
</script>

<style lang="less" scoped>
.editor__header {
  width: 100%;
}
.header__item {
  margin: 0 3px;
}
.header__item_last {
  margin-right: 8px;
}
.header__switch {
  margin-left: 8px;
}
.mode__switch {
  margin-left: 24px;
  margin-right: 24px;
  width: 24px;
  height: 24px;
  background: url('../../assets/images/night.png') no-repeat;
  background-size: cover;
  transition: all 0.3s;
}
.mode__switch_black {
  background: url('../../assets/images/light.png') no-repeat;
  background-size: cover;
}
.top {
  height: 60px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  margin-right: 0;
}
.el-select {
  margin-right: 12px;
}
.left-side {
  display: flex;
  align-items: center;
  flex: 1;
}
.right-side {
  display: flex;
  align-items: center;
}

/*
.preview table tr:nth-child(even){
  background: rgb(250, 250, 250);
}
 */
.select-item-left {
  float: left;
}

.select-item-right {
  float: right;
  color: #8492a6;
  font-size: 13px;
}
</style>
