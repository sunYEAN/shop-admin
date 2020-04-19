<template>
  <div class="tiny-editor">
    <editor class="editor" id="tinymce" :value="value" :init="options" @input="handleEditorInput"></editor>
  </div>
</template>

<script>
    import tinymce from 'tinymce/tinymce';
    import Editor from '@tinymce/tinymce-vue';
    import 'tinymce/themes/silver';
    import 'tinymce/plugins/image';
    import 'tinymce/plugins/media'// 插入视频插件
    import 'tinymce/plugins/table'// 插入表格插件
    import 'tinymce/plugins/lists'// 列表插件
    import 'tinymce/plugins/wordcount'// 字数统计插件

    import {upload} from '../../api/common';
    export default {
        name: "TinyEditor",
        components: {
            Editor
        },
        model: {
            prop: 'html',
            event: 'change'
        },
        props: {
            html: String
        },
        data () {
            return {
                value: '',
                options: {
                    language_url: '/tinymce/langs/zh_CN.js',
                    language: 'zh_CN',
                    skin_url: '/tinymce/skins/ui/oxide',
                    content_css: '/tinymce/skins/content/default/content.css',
                    branding: false,
                    menubar: false,
                    plugins: 'lists image media table wordcount',
                    toolbar: 'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat',
                    images_upload_handler: (blobInfo, success, fail) => {
                        let formData = new FormData();
                        formData.append('image', blobInfo.blob());
                        upload(formData)
                            .then(res => {
                                console.log(res);
                                success(res.data.url);
                            })
                            .catch(err => {
                                fail(err.message);
                            })

                    },
                }
            }
        },
        methods: {
            /**
             * event handler 富文本内容改变
             * @param e
             */
            handleEditorInput (e) {
                this.$emit('change', e);
            }
        }
    }
</script>

<style scoped lang="less">
  .tiny-editor{
    .editor{
    }
  }
</style>
