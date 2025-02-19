from django.core.management.base import BaseCommand
from drf.models import UserProfile, Comment, Interest, Author, Publisher, News, CustomUser


class Command(BaseCommand):
    help = 'Populate initial data'

    def handle(self, *args, **options):
        # Create 4 users with profiles
        for i in range(1, 5):
            user = CustomUser.objects.create(username=f'user{i}', email=f'user{i}@example.com')
            user.set_password(f'user{i}')
            user.save()
            profile = UserProfile.objects.create(user=user)

        # Create 20 comments
        users = CustomUser.objects.all()[:4]  # Select the 4 users
        news_items = News.objects.all()[:30]  # Select the first 30 news items
        for news in news_items:
            for user in users:
                Comment.objects.create(user=user, news=news, text=f'Comment on {news.title} by {user.username}')

        # Create 5 interests
        for i in range(1, 6):
            Interest.objects.create(name=f'Interest{i}')

        # Create 3 authors
        users = []
        for user in CustomUser.objects.all():
            if not user.is_admin and len(users) < 3:
                users.append(user)

        publishers = [Publisher.objects.create(name=f'Publisher{i}') for i in range(1, 6)]  # Create 5 publishers
        for user, publisher in zip(users, publishers):
            #updade the user to be an author
            user.is_author = True
            user.save()
            Author.objects.create(user=user, publisher=publisher)

        # Create 5 publishers
        for i in range(6, 11):
            Publisher.objects.create(name=f'Publisher{i}')


        # Create 30 news items
        authors = Author.objects.all()[:3]  # Select the first 3 authors
        interests = Interest.objects.all()[:5]
        for i in range(1, 31):
            author = authors[i % 3]
            news = News.objects.create(title=f'News {i}',description='Lorem ipsum dolor sit amet. ',
                                       content='Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae finibus mauris, id elementum neque. Donec et rhoncus justo, vitae ullamcorper orci. Etiam fermentum quam lacus, condimentum varius neque aliquam eu. Suspendisse potenti. Maecenas vulputate eget enim sit amet ullamcorper. Proin fermentum sagittis quam, sit amet convallis neque rutrum et. Mauris a leo quis felis tempor bibendum.'
                                               'Duis ultrices, purus nec vehicula ullamcorper, orci dui ornare metus, interdum malesuada mi ipsum non massa. Fusce blandit, nunc eget feugiat tincidunt, mauris nisl blandit leo, sed lobortis urna diam sit amet ligula. Ut sollicitudin risus sed nulla tristique congue. Mauris eget ante mollis, semper justo et, pharetra sapien. Nullam metus magna, accumsan et nibh et, commodo dictum lorem. Aliquam porta nunc tellus. Sed maximus pulvinar suscipit. Suspendisse elit metus, tempus eget facilisis quis, rhoncus ac velit. Aenean sit amet blandit sem.'
                                               ,
                                       published_by=author)
            news.tags.set(interests)

        self.stdout.write(self.style.SUCCESS('Data populated successfully.'))
